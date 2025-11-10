import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workshop, WorkshopStatus } from '../../../entities/workshop.entity';
import {
  WorkshopMember,
  WorkshopMemberRole,
} from '../../../entities/workshop-member.entity';
import { WorkshopLocation } from '../../../entities/workshop-location.entity';
import {
  WorkshopCampaign,
  WorkshopCampaignDiscountType,
  WorkshopCampaignStatus,
} from '../../../entities/workshop-campaign.entity';
import { MaintenanceRegulation } from '../../../entities/maintenance-regulation.entity';
import { CreateWorkshopDto } from '../dto/create-workshop.dto';
import { CreateWorkshopLocationDto } from '../dto/create-location.dto';
import { CreateWorkshopCampaignDto } from '../dto/create-campaign.dto';
import { User, UserRole } from '../../auth/entities/user.entity';

@Injectable()
export class WorkshopsAdminService {
  constructor(
    @InjectRepository(Workshop)
    private readonly workshopRepo: Repository<Workshop>,
    @InjectRepository(WorkshopMember)
    private readonly memberRepo: Repository<WorkshopMember>,
    @InjectRepository(WorkshopLocation)
    private readonly locationRepo: Repository<WorkshopLocation>,
    @InjectRepository(WorkshopCampaign)
    private readonly campaignRepo: Repository<WorkshopCampaign>,
    @InjectRepository(MaintenanceRegulation)
    private readonly regulationRepo: Repository<MaintenanceRegulation>,
  ) {}

  async createWorkshop(
    userId: number,
    dto: CreateWorkshopDto,
  ): Promise<Workshop> {
    const workshop = await this.workshopRepo.save(
      this.workshopRepo.create({
        legalName: dto.legalName,
        brandName: dto.brandName,
        description: dto.description,
        website: dto.website,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        status: dto.status ?? WorkshopStatus.DRAFT,
      }),
    );

    await this.memberRepo.save(
      this.memberRepo.create({
        workshop,
        user: { id: userId } as User,
        role: WorkshopMemberRole.OWNER,
      }),
    );

    return workshop;
  }

  listMyWorkshops(userId: number) {
    return this.workshopRepo
      .createQueryBuilder('workshop')
      .leftJoin('workshop.members', 'member')
      .where('member.user_id = :userId', { userId })
      .loadRelationCountAndMap(
        'workshop.locationsCount',
        'workshop.locations',
      )
      .getMany();
  }

  async addLocation(
    workshopId: string,
    userId: number,
    dto: CreateWorkshopLocationDto,
  ): Promise<WorkshopLocation> {
    const workshop = await this.ensureMembership(workshopId, userId);

    const location = this.locationRepo.create({
      workshop,
      title: dto.title,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
      timezone: dto.timezone,
      isPrimary: dto.isPrimary ?? false,
    });

    return this.locationRepo.save(location);
  }

  async createCampaign(
    workshopId: string,
    userId: number,
    dto: CreateWorkshopCampaignDto,
  ): Promise<WorkshopCampaign> {
    const workshop = await this.ensureMembership(workshopId, userId);

    let targetRegulation: MaintenanceRegulation | null = null;
    const targetRegulationId = dto.targetRegulationId
      ? Number(dto.targetRegulationId)
      : undefined;
    if (targetRegulationId) {
      targetRegulation = await this.regulationRepo.findOne({
        where: { id: targetRegulationId },
      });

      if (!targetRegulation) {
        throw new NotFoundException('Target regulation not found');
      }
    }

    const campaign = this.campaignRepo.create({
      workshop,
      title: dto.title,
      description: dto.description,
      discountType: dto.discountType ?? WorkshopCampaignDiscountType.PERCENT,
      discountValue: dto.discountValue.toString(),
      terms: dto.terms,
      status: dto.status ?? WorkshopCampaignStatus.DRAFT,
      startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
      endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      targetCarType: dto.targetCarType,
      targetRegulation: targetRegulation ?? undefined,
    });

    return this.campaignRepo.save(campaign);
  }

  private async ensureMembership(
    workshopId: string,
    userId: number,
  ): Promise<Workshop> {
    const membership = await this.memberRepo.findOne({
      where: {
        workshop: { id: workshopId },
        user: { id: userId },
      },
      relations: ['workshop'],
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this workshop');
    }

    return membership.workshop;
  }

  ensureWorkshopRole(user: { role: UserRole }) {
    if (
      user.role !== UserRole.WORKSHOP_ADMIN &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException('Only workshop admins can access this route');
    }
  }
}
