import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaintenanceRegulationDto } from './maintenance-regulation.dto';

export class MaintenanceTaskResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ['pending', 'completed'] })
  status!: 'pending' | 'completed';

  @ApiPropertyOptional({
    description: 'Date when the task should be completed',
  })
  dueDate?: Date;

  @ApiPropertyOptional({
    description: 'Mileage when the task should be completed',
  })
  dueMileage?: number;

  @ApiPropertyOptional({ description: 'When the task was completed' })
  completedAt?: Date;

  @ApiPropertyOptional({ description: 'Mileage at completion' })
  completedMileage?: number;

  @ApiProperty({ type: MaintenanceRegulationDto })
  regulation!: MaintenanceRegulationDto;
}
