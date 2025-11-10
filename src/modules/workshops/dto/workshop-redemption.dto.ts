import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkshopRedemptionDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  campaignId!: string;

  @ApiProperty()
  campaignTitle!: string;

  @ApiProperty()
  workshopName!: string;

  @ApiProperty()
  locationTitle!: string;

  @ApiPropertyOptional()
  note?: string;

  @ApiProperty()
  status!: 'issued' | 'redeemed' | 'expired';

  @ApiPropertyOptional()
  redeemedAt?: Date;
}
