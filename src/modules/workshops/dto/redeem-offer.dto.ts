import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class RedeemOfferDto {
  @ApiProperty({ description: 'Campaign identifier' })
  @IsUUID()
  campaignId!: string;

  @ApiProperty({ description: 'QR slug taken from workshop location' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  locationSlug!: string;

  @ApiProperty({ description: 'Consumer car identifier' })
  @IsUUID()
  carId!: string;

  @ApiPropertyOptional({ description: 'Maintenance task tied to the visit' })
  @IsOptional()
  @IsUUID()
  maintenanceTaskId?: string;

  @ApiPropertyOptional({ description: 'Optional note recorded for the workshop' })
  @IsOptional()
  @IsString()
  note?: string;
}
