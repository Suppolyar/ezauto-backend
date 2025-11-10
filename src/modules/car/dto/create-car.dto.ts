import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty({
    example: '1HGCM82633A004352',
    description: 'Vehicle Identification Number (VIN)',
  })
  @IsString()
  vin!: string;

  @ApiPropertyOptional({ example: 'Toyota', description: 'Car brand' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: 'Corolla', description: 'Car model' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 2020, description: 'Year of manufacture' })
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiPropertyOptional({
    example: 'base',
    description: 'Type of the car used for regulation matching',
    enum: ['base', 'sport', 'luxury'],
  })
  @IsOptional()
  @IsIn(['base', 'sport', 'luxury'])
  type?: 'base' | 'sport' | 'luxury';

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
  annualMileage!: number;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Optional user ID (UUID)',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
