import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { MaintenanceService } from '../services/maintenance.service';
import { MaintenanceRecommendationResponseDto } from '../dto/maintenance-recommendation-response.dto';
import { Car } from '../../../entities/car.entity';

@ApiTags('Maintenance')
@Controller('cars/:id/maintenance')
export class MaintenanceController {
  constructor(
    private readonly maintenanceService: MaintenanceService,
    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,
  ) {}

  @Get('recommendations')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    description: 'Maintenance recommendations for a car',
    type: MaintenanceRecommendationResponseDto,
  })
  async getMaintenance(
    @Param('id') id: string,
  ): Promise<MaintenanceRecommendationResponseDto> {
    const car = await this.carRepo.findOneOrFail({ where: { id } });

    const recommendations =
      await this.maintenanceService.getRecommendations(car);

    return { recommendations };
  }
}
