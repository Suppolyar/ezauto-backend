import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MaintenanceController } from './controllers/maintenance.controller';
import { MaintenanceService } from './services/maintenance.service';
import { MaintenanceRegulation } from '../../entities/maintenance-regulation.entity';
import { Car } from '../../entities/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceRegulation, Car])],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
})
export class MaintenanceModule {}
