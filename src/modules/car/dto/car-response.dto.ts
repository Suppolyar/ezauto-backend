// src/car/dto/car-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CarResponseDto {
  @ApiProperty({ example: 'uuid', description: 'Car ID' })
  id: string;

  @ApiProperty({ example: '1HGCM82633A004352', description: 'VIN number' })
  vin: string;

  @ApiProperty({ example: 'Toyota', description: 'Brand of the car' })
  brand: string;

  @ApiProperty({ example: 'Corolla', description: 'Model of the car' })
  model: string;

  @ApiPropertyOptional({ example: 2020, description: 'Year of manufacture' })
  year?: number;

  @ApiProperty({ example: 45000, description: 'Current mileage (in km)' })
  mileage: number;

  @ApiProperty({
    example: 15000,
    description: 'Average annual mileage (in km)',
  })
  annualMileage: number;

  @ApiProperty({ example: 'user-uuid', description: 'User ID' })
  userId: number;

  @ApiPropertyOptional({
    description: 'Decoded VIN payload returned by provider',
  })
  vinDecodedData?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Estimated mileage when next maintenance is due',
  })
  nextMaintenanceMileage?: number;

  @ApiPropertyOptional({
    description: 'Estimated date for next maintenance check',
  })
  nextMaintenanceDate?: Date;
}
