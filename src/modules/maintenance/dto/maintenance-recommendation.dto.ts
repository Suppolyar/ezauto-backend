import { ApiProperty } from '@nestjs/swagger';

export class MaintenanceRecommendationDto {
  @ApiProperty({ example: 'Engine Oil' })
  item: string;

  @ApiProperty({ example: 5000 })
  intervalMiles: number;

  @ApiProperty({ example: 6 })
  intervalMonths: number;

  @ApiProperty({ example: 'Replace engine oil and filter' })
  description: string;

  @ApiProperty({
    example: 'medium',
    enum: ['low', 'medium', 'high'],
    required: false,
  })
  severity?: 'low' | 'medium' | 'high';
}
