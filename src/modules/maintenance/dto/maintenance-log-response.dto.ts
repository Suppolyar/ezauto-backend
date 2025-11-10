import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MaintenanceLogResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  mileage!: number;

  @ApiProperty()
  performedAt!: Date;

  @ApiPropertyOptional()
  notes?: string;
}
