import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { Car } from '../entities/car.entity';
import { User } from '../entities/user.entity';
import { MaintenanceRegulation } from '../entities/maintenance-regulation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, User, MaintenanceRegulation])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
