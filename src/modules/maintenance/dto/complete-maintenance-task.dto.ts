import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompleteMaintenanceTaskDto {
  @ApiProperty({ example: 56000, description: 'Mileage when work was done' })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  mileage!: number;

  @ApiPropertyOptional({
    example: 'Changed oil and filter',
    description: 'Optional comment',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Optional ISO date when work was completed',
  })
  @IsOptional()
  @IsDateString()
  performedAt?: string;
}
