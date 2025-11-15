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
import { CarTypeRule } from '../../entities/car-type-rule.entity';
import { CarTypeResolverService } from './services/car-type-resolver.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Car,
      User,
      MaintenanceRegulation,
      MaintenanceTask,
      MaintenanceLog,
      CarTypeRule,
    ]),
    MaintenanceModule,
    VinModule,
  ],
  controllers: [CarController],
  providers: [CarService, CarTypeResolverService],
})
export class CarModule {}
