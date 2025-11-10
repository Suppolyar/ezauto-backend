import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkshopLocationDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  address!: string;

  @ApiProperty()
  latitude!: number;

  @ApiProperty()
  longitude!: number;

  @ApiPropertyOptional()
  timezone?: string;

  @ApiProperty()
  qrSlug!: string;
}
