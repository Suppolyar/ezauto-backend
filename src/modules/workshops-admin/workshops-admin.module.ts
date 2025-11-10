import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workshop } from '../../entities/workshop.entity';
import { WorkshopMember } from '../../entities/workshop-member.entity';
import { WorkshopLocation } from '../../entities/workshop-location.entity';
import { WorkshopCampaign } from '../../entities/workshop-campaign.entity';
import { MaintenanceRegulation } from '../../entities/maintenance-regulation.entity';
import { WorkshopsAdminService } from './services/workshops-admin.service';
import { WorkshopsAdminController } from './controllers/workshops-admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workshop,
      WorkshopMember,
      WorkshopLocation,
      WorkshopCampaign,
      MaintenanceRegulation,
    ]),
  ],
  controllers: [WorkshopsAdminController],
  providers: [WorkshopsAdminService],
})
export class WorkshopsAdminModule {}
