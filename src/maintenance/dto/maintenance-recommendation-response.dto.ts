// src/maintenance/dto/maintenance-recommendation-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceRecommendationDto } from './maintenance-recommendation.dto';

export class MaintenanceRecommendationResponseDto {
  @ApiProperty({ type: [MaintenanceRecommendationDto] })
  recommendations: MaintenanceRecommendationDto[];
}
