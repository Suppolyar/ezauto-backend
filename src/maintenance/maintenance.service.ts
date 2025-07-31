import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MaintenanceRecommendationDto } from './dto/maintenance-recommendation.dto';
import { MaintenanceRegulation } from '../entities/maintenance-regulation.entity';
import { Car } from '../entities/car.entity';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(MaintenanceRegulation)
    private readonly regulationsRepo: Repository<MaintenanceRegulation>,
  ) {}

  async getRecommendations(car: Car): Promise<MaintenanceRecommendationDto[]> {
    const regulations = await this.regulationsRepo.find({
      where: { carType: car.type },
    });

    return regulations.map((r) => ({
      item: r.item,
      intervalMiles: r.intervalMiles,
      intervalMonths: r.intervalMonths,
      description: r.description,
      severity: r.severity ?? 'medium',
    }));
  }
}
