import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkshopCampaign, WorkshopCampaignStatus } from '../../../entities/workshop-campaign.entity';
import { WorkshopOfferDto } from '../dto/workshop-offer.dto';
import { WorkshopOffersQueryDto } from '../dto/workshop-offers-query.dto';
import { Car } from '../../../entities/car.entity';
import { MaintenanceTask } from '../../../entities/maintenance-task.entity';

interface OfferQuery {
  userId: number;
  filters: WorkshopOffersQueryDto;
}

@Injectable()
export class WorkshopOffersService {
  constructor(
    @InjectRepository(WorkshopCampaign)
    private readonly campaignRepo: Repository<WorkshopCampaign>,
    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,
    @InjectRepository(MaintenanceTask)
    private readonly taskRepo: Repository<MaintenanceTask>,
  ) {}

  async listOffers(params: OfferQuery): Promise<WorkshopOfferDto[]> {
    const now = new Date();
    const car = await this.resolveCar(params.filters.carId, params.userId);
    const regulationId = await this.resolveRegulationId(
      params.filters.maintenanceTaskId,
      params.userId,
    );

    const qb = this.campaignRepo
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.workshop', 'workshop')
      .leftJoinAndSelect('workshop.locations', 'location')
      .leftJoinAndSelect('campaign.targetRegulation', 'regulation')
      .where('campaign.status = :status', {
        status: WorkshopCampaignStatus.ACTIVE,
      })
      .andWhere('(campaign.startsAt IS NULL OR campaign.startsAt <= :now)', {
        now,
      })
      .andWhere('(campaign.endsAt IS NULL OR campaign.endsAt >= :now)', { now });

    if (car?.type) {
      qb.andWhere(
        '(campaign."targetCarType" IS NULL OR campaign."targetCarType" = :carType)',
        { carType: car.type },
      );
    }

    if (regulationId) {
      qb.andWhere(
        '(campaign."target_regulation_id" IS NULL OR campaign."target_regulation_id" = :regId)',
        { regId: regulationId },
      );
    }

    if (params.filters.search) {
      qb.andWhere('workshop."brandName" ILIKE :search', {
        search: `%${params.filters.search}%`,
      });
    }

    if (params.filters.lat !== undefined && params.filters.lng !== undefined) {
      const delta = (params.filters.radiusKm ?? 50) / 111;
      qb.andWhere(
        'location.latitude BETWEEN :minLat AND :maxLat AND location.longitude BETWEEN :minLng AND :maxLng',
        {
          minLat: params.filters.lat - delta,
          maxLat: params.filters.lat + delta,
          minLng: params.filters.lng - delta,
          maxLng: params.filters.lng + delta,
        },
      );
    }

    qb.orderBy('campaign.updatedAt', 'DESC');

    const campaigns = await qb.getMany();

    return campaigns.map((campaign) => ({
      campaignId: campaign.id,
      workshopId: campaign.workshop.id,
      workshopName: campaign.workshop.brandName,
      workshopDescription: campaign.workshop.description ?? undefined,
      discountType: campaign.discountType,
      discountValue: Number(campaign.discountValue),
      terms: campaign.terms ?? undefined,
      targetCarType: (campaign.targetCarType as
        | 'base'
        | 'sport'
        | 'luxury'
        | undefined) ?? undefined,
      targetRegulationId: campaign.targetRegulation?.id ?? undefined,
      locations: campaign.workshop.locations.map((location) => ({
        id: location.id,
        title: location.title,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone ?? undefined,
        qrSlug: location.qrSlug,
      })),
    }));
  }

  async getOffersForTask(
    task: MaintenanceTask,
    limit = 3,
  ): Promise<WorkshopOfferDto[]> {
    const filters = new WorkshopOffersQueryDto();
    filters.carId = task.car.id;
    filters.maintenanceTaskId = task.id;

    const offers = await this.listOffers({
      userId: task.car.user.id,
      filters,
    });

    return offers.slice(0, limit);
  }

  private async resolveCar(carId: string | undefined, userId: number) {
    if (!carId) {
      return null;
    }

    return this.carRepo.findOne({
      where: { id: carId, user: { id: userId } },
    });
  }

  private async resolveRegulationId(
    taskId: string | undefined,
    userId: number,
  ): Promise<number | undefined> {
    if (!taskId) {
      return undefined;
    }

    const task = await this.taskRepo.findOne({
      where: { id: taskId, car: { user: { id: userId } } },
      relations: ['regulation'],
    });

    return task?.regulation?.id ?? undefined;
  }
}
