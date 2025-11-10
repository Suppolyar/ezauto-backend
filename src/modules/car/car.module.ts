import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarController } from './controlles/car.controller';
import { CarService } from './services/car.service';
import { Car } from '../../entities/car.entity';
import { User } from '../auth/entities/user.entity';
import { MaintenanceRegulation } from '../../entities/maintenance-regulation.entity';
import { MaintenanceTask } from '../../entities/maintenance-task.entity';
import { MaintenanceLog } from '../../entities/maintenance-log.entity';
import { MaintenanceModule } from '../maintenance/maintenance.module';
import { VinModule } from '../vin/vin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Car,
      User,
      MaintenanceRegulation,
      MaintenanceTask,
      MaintenanceLog,
    ]),
    MaintenanceModule,
    VinModule,
  ],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
