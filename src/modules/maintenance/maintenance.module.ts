import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MaintenanceController } from './controllers/maintenance.controller';
import { MaintenanceService } from './services/maintenance.service';
import { MaintenanceRegulation } from '../../entities/maintenance-regulation.entity';
import { Car } from '../../entities/car.entity';
import { MaintenanceTask } from '../../entities/maintenance-task.entity';
import { MaintenanceLog } from '../../entities/maintenance-log.entity';
import { MaintenancePlannerService } from './services/maintenance-planner.service';
import { MaintenanceTasksService } from './services/maintenance-tasks.service';
import { WorkshopCampaignRedemption } from '../../entities/workshop-campaign-redemption.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MaintenanceRegulation,
      Car,
      MaintenanceTask,
      MaintenanceLog,
      WorkshopCampaignRedemption,
    ]),
  ],
  controllers: [MaintenanceController],
  providers: [
    MaintenanceService,
    MaintenancePlannerService,
    MaintenanceTasksService,
  ],
  exports: [MaintenancePlannerService, MaintenanceTasksService],
})
export class MaintenanceModule {}
