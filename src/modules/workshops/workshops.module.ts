import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkshopsController } from './controllers/workshops.controller';
import { Workshop } from '../../entities/workshop.entity';
import { WorkshopMember } from '../../entities/workshop-member.entity';
import { WorkshopLocation } from '../../entities/workshop-location.entity';
import { WorkshopCampaign } from '../../entities/workshop-campaign.entity';
import { WorkshopCampaignRedemption } from '../../entities/workshop-campaign-redemption.entity';
import { WorkshopOffersService } from './services/workshop-offers.service';
import { WorkshopRedemptionService } from './services/workshop-redemption.service';
import { Car } from '../../entities/car.entity';
import { MaintenanceTask } from '../../entities/maintenance-task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workshop,
      WorkshopMember,
      WorkshopLocation,
      WorkshopCampaign,
      WorkshopCampaignRedemption,
      Car,
      MaintenanceTask,
    ]),
  ],
  controllers: [WorkshopsController],
  providers: [WorkshopOffersService, WorkshopRedemptionService],
  exports: [WorkshopOffersService],
})
export class WorkshopsModule {}
