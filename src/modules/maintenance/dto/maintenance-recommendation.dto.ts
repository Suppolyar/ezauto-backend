import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaintenanceRegulationDto } from './maintenance-regulation.dto';

export type MaintenanceRecommendationReason =
  | 'overdue'
  | 'due_soon_date'
  | 'due_soon_mileage'
  | 'scheduled';

export class MaintenanceRecommendationDto {
  @ApiProperty({ example: '6aef90c9-83a6-4d5d-8c7e-3320a7dfb53d' })
  taskId!: string;

  @ApiProperty({ type: MaintenanceRegulationDto })
  regulation!: MaintenanceRegulationDto;

  @ApiPropertyOptional({
    description: 'Date when the maintenance task becomes due',
  })
  dueDate?: Date;

  @ApiPropertyOptional({
    description: 'Mileage when the maintenance task becomes due',
  })
  dueMileage?: number;

  @ApiProperty({
    description: 'Why this recommendation is shown',
    enum: ['overdue', 'due_soon_date', 'due_soon_mileage', 'scheduled'],
    example: 'due_soon_date',
  })
  reason!: MaintenanceRecommendationReason;
}
