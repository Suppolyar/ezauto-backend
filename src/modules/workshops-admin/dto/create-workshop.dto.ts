import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { WorkshopStatus } from '../../../entities/workshop.entity';

export class CreateWorkshopDto {
  @ApiProperty({ description: 'Legal company name' })
  @IsString()
  @Length(2, 120)
  legalName!: string;

  @ApiProperty({ description: 'Brand name shown to consumers' })
  @IsString()
  @Length(2, 80)
  brandName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ enum: WorkshopStatus })
  @IsOptional()
  @IsEnum(WorkshopStatus)
  status?: WorkshopStatus;
}
