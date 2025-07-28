import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty({
    example: '1HGCM82633A004352',
    description: 'Vehicle Identification Number (VIN)',
  })
  @IsString()
  vin!: string;

  @ApiProperty({ example: 'Toyota', description: 'Car brand' })
  @IsString()
  brand!: string;

  @ApiProperty({ example: 'Corolla', description: 'Car model' })
  @IsString()
  model!: string;

  @ApiProperty({ example: 2020, description: 'Year of manufacture' })
  @IsNumber()
  year!: number;

  @ApiProperty({
    example: 45000,
    description: 'Current mileage (in kilometers)',
  })
  @IsNumber()
  mileage!: number;

  @ApiProperty({
    example: 15000,
    description: 'Average annual mileage (in kilometers)',
  })
  @IsNumber()
  averageMileagePerYear!: number;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Optional user ID (UUID)',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
