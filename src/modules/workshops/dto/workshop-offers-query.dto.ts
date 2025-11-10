import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class WorkshopOffersQueryDto {
  @ApiPropertyOptional({ description: 'Latitude for geo filtering' })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  @ApiPropertyOptional({ description: 'Longitude for geo filtering' })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng?: number;

  @ApiPropertyOptional({ description: 'Search radius in kilometers', default: 50 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  radiusKm?: number;

  @ApiPropertyOptional({ description: 'Filter offers for a specific car' })
  @IsOptional()
  @IsUUID()
  carId?: string;

  @ApiPropertyOptional({
    description: 'Filter offers for a specific maintenance task',
  })
  @IsOptional()
  @IsUUID()
  maintenanceTaskId?: string;

  @ApiPropertyOptional({
    description: 'Optional free text search by workshop brand name',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
