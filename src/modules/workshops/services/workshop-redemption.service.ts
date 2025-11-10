import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
import {
  WorkshopCampaign,
  WorkshopCampaignStatus,
} from '../../../entities/workshop-campaign.entity';
import { WorkshopLocation } from '../../../entities/workshop-location.entity';
import {
  WorkshopCampaignRedemption,
  WorkshopCampaignRedemptionStatus,
} from '../../../entities/workshop-campaign-redemption.entity';
import { Car } from '../../../entities/car.entity';
import { MaintenanceTask } from '../../../entities/maintenance-task.entity';
import { RedeemOfferDto } from '../dto/redeem-offer.dto';
import { WorkshopRedemptionDto } from '../dto/workshop-redemption.dto';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class WorkshopRedemptionService {
  constructor(
    @InjectRepository(WorkshopCampaign)
    private readonly campaignRepo: Repository<WorkshopCampaign>,
    @InjectRepository(WorkshopLocation)
    private readonly locationRepo: Repository<WorkshopLocation>,
    @InjectRepository(WorkshopCampaignRedemption)
    private readonly redemptionRepo: Repository<WorkshopCampaignRedemption>,
    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,
    @InjectRepository(MaintenanceTask)
    private readonly taskRepo: Repository<MaintenanceTask>,
  ) {}

  async redeem(userId: number, dto: RedeemOfferDto): Promise<WorkshopCampaignRedemption> {
    const campaign = await this.campaignRepo.findOne({
      where: { id: dto.campaignId },
      relations: ['workshop'],
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (campaign.status !== WorkshopCampaignStatus.ACTIVE) {
      throw new BadRequestException('Campaign is not active');
    }

    const now = new Date();
    if ((campaign.startsAt && campaign.startsAt > now) || (campaign.endsAt && campaign.endsAt < now)) {
      throw new BadRequestException('Campaign is outside of its active window');
    }

    const location = await this.locationRepo.findOne({
      where: { qrSlug: dto.locationSlug },
      relations: ['workshop'],
    });

    if (!location || location.workshop.id !== campaign.workshop.id) {
      throw new BadRequestException('Location is not associated with this campaign');
    }

    const car = await this.carRepo.findOne({
      where: { id: dto.carId, user: { id: userId } },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    let maintenanceTask: MaintenanceTask | null = null;
    if (dto.maintenanceTaskId) {
      maintenanceTask = await this.taskRepo.findOne({
        where: {
          id: dto.maintenanceTaskId,
          car: { id: car.id, user: { id: userId } },
        },
      });

      if (!maintenanceTask) {
        throw new NotFoundException('Maintenance task not found');
      }
    }

    const redemption = this.redemptionRepo.create({
      campaign,
      location,
      user: { id: userId } as User,
      car,
      maintenanceTask: maintenanceTask ?? undefined,
      status: WorkshopCampaignRedemptionStatus.REDEEMED,
      discountValue: campaign.discountValue,
      note: dto.note,
      redeemedAt: new Date(),
    });

    const saved = await this.redemptionRepo.save(redemption);

    return this.redemptionRepo.findOne({
      where: { id: saved.id },
      relations: ['campaign', 'campaign.workshop', 'location'],
    }) as Promise<WorkshopCampaignRedemption>;
  }

  async listUserRedemptions(userId: number): Promise<WorkshopRedemptionDto[]> {
    const redemptions = await this.redemptionRepo.find({
      where: { user: { id: userId } },
      relations: ['campaign', 'campaign.workshop', 'location'],
      order: { updatedAt: 'DESC' },
      take: 50,
    });

    return redemptions.map((item) => ({
      id: item.id,
      campaignId: item.campaign.id,
      campaignTitle: item.campaign.title,
      workshopName: item.campaign.workshop.brandName,
      locationTitle: item.location?.title ?? 'Any location',
      note: item.note ?? undefined,
      status: item.status,
      redeemedAt: item.redeemedAt ?? undefined,
    }));
  }
}
