import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
import {
  WorkshopCampaignDiscountType,
  WorkshopCampaignStatus,
} from '../../../entities/workshop-campaign.entity';

export class CreateWorkshopCampaignDto {
  @ApiProperty()
  @IsString()
  @Length(3, 120)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: WorkshopCampaignDiscountType })
  @IsEnum(WorkshopCampaignDiscountType)
  discountType!: WorkshopCampaignDiscountType;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  discountValue!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  terms?: string;

  @ApiPropertyOptional({ enum: WorkshopCampaignStatus })
  @IsOptional()
  @IsEnum(WorkshopCampaignStatus)
  status?: WorkshopCampaignStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @ApiPropertyOptional({
    enum: ['base', 'sport', 'luxury'],
    description: 'Limit campaign to a specific car type',
  })
  @IsOptional()
  @IsString()
  targetCarType?: 'base' | 'sport' | 'luxury';

  @ApiPropertyOptional({
    description: 'Link to maintenance regulation for recommendation targeting',
  })
  @IsOptional()
  @IsInt()
  targetRegulationId?: number;
}
