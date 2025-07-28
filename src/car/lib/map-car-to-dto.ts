// src/car/lib/mapCarToDto.ts
import { Car } from '../../entities/car.entity';
import { CarResponseDto } from '../dto/car-response.dto';

export const mapCarToDto = (car: Car): CarResponseDto => ({
  id: car.id,
  vin: car.vin,
  brand: car.brand,
  model: car.model,
  year: car.year,
  mileage: car.mileage,
  averageMileagePerYear: car.averageMileagePerYear,
  userId: car.user.id,
});

export const mapCarsToDtos = (cars: Car[]): CarResponseDto[] =>
  cars.map(mapCarToDto);
