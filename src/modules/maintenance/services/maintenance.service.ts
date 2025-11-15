import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  MaintenanceRecommendationDto,
  MaintenanceRecommendationReason,
} from '../dto/maintenance-recommendation.dto';
import { Car } from '../../../entities/car.entity';
import {
  MaintenanceTask,
  MaintenanceTaskStatus,
} from '../../../entities/maintenance-task.entity';

const DUE_SOON_MONTHS_THRESHOLD = 2;
const DUE_SOON_MILEAGE_BUFFER = 2000;

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(MaintenanceTask)
    private readonly tasksRepo: Repository<MaintenanceTask>,
  ) {}

  async getRecommendations(car: Car): Promise<MaintenanceRecommendationDto[]> {
    const tasks = await this.tasksRepo.find({
      where: {
        car: { id: car.id },
        status: MaintenanceTaskStatus.PENDING,
      },
      order: {
        dueDate: 'ASC',
        dueMileage: 'ASC',
      },
    });

    const mapped = tasks.map((task) =>
      this.mapTaskToRecommendation(task, car.mileage),
    );
    const prioritized = mapped.filter((rec) => rec.reason !== 'scheduled');

    if (prioritized.length > 0) {
      return prioritized.slice(0, 5);
    }

    return mapped.slice(0, 5);
  }

  private mapTaskToRecommendation(
    task: MaintenanceTask,
    currentMileage: number,
  ): MaintenanceRecommendationDto {
    const dueDate = task.dueDate ?? undefined;
    const dueMileage = task.dueMileage ?? undefined;
    const reason = this.resolveReason({
      dueDate,
      dueMileage,
      currentMileage,
    });

    return {
      taskId: task.id,
      regulation: {
        item: task.regulation.item,
        intervalMiles: task.regulation.intervalMiles,
        intervalMonths: task.regulation.intervalMonths,
        description: task.regulation.description,
        severity: task.regulation.severity ?? 'medium',
      },
      dueDate,
      dueMileage,
      reason,
    };
  }

  private resolveReason(params: {
    dueDate?: Date;
    dueMileage?: number;
    currentMileage: number;
  }): MaintenanceRecommendationReason {
    const now = new Date();
    const isOverdue =
      (params.dueDate && params.dueDate.getTime() <= now.getTime()) ||
      (typeof params.dueMileage === 'number' &&
        params.dueMileage <= params.currentMileage);

    if (isOverdue) {
      return 'overdue';
    }

    const dateThreshold = new Date(now);
    dateThreshold.setMonth(
      dateThreshold.getMonth() + DUE_SOON_MONTHS_THRESHOLD,
    );

    if (
      params.dueDate &&
      params.dueDate.getTime() <= dateThreshold.getTime()
    ) {
      return 'due_soon_date';
    }

    if (
      typeof params.dueMileage === 'number' &&
      params.dueMileage - params.currentMileage <= DUE_SOON_MILEAGE_BUFFER
    ) {
      return 'due_soon_mileage';
    }

    return 'scheduled';
  }
}
