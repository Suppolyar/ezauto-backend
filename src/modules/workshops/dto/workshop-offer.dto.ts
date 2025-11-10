import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkshopLocationDto } from './workshop-location.dto';

export class WorkshopOfferDto {
  @ApiProperty()
  campaignId!: string;

  @ApiProperty()
  workshopId!: string;

  @ApiProperty()
  workshopName!: string;

  @ApiPropertyOptional()
  workshopDescription?: string;

  @ApiProperty()
  discountType!: 'percent' | 'fixed';

  @ApiProperty()
  discountValue!: number;

  @ApiPropertyOptional()
  terms?: string;

  @ApiPropertyOptional()
  targetCarType?: 'base' | 'sport' | 'luxury';

  @ApiPropertyOptional()
  targetRegulationId?: number;

  @ApiProperty({ type: [WorkshopLocationDto] })
  locations!: WorkshopLocationDto[];
}
