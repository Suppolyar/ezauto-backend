import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarController } from './controlles/car.controller';
import { CarService } from './services/car.service';
import { Car } from '../../entities/car.entity';
import { User } from '../auth/entities/user.entity';
import { MaintenanceRegulation } from '../../entities/maintenance-regulation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, User, MaintenanceRegulation])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
