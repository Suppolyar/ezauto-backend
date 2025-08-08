// src/car/dto/car-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CarResponseDto {
  @ApiProperty({ example: 'uuid', description: 'Car ID' })
  id: string;

  @ApiProperty({ example: '1HGCM82633A004352', description: 'VIN number' })
  vin: string;

  @ApiProperty({ example: 'Toyota', description: 'Brand of the car' })
  brand: string;

  @ApiProperty({ example: 'Corolla', description: 'Model of the car' })
  model: string;

  @ApiProperty({ example: 2020, description: 'Year of manufacture' })
  year: number;

  @ApiProperty({ example: 45000, description: 'Current mileage (in km)' })
  mileage: number;

  @ApiProperty({
    example: 15000,
    description: 'Average annual mileage (in km)',
  })
  averageMileagePerYear: number;

  @ApiProperty({ example: 'user-uuid', description: 'User ID' })
  userId: number;
}
