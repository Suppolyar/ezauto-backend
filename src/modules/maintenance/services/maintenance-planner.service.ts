import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceRegulation } from '../../../entities/maintenance-regulation.entity';
import {
  MaintenanceTask,
  MaintenanceTaskStatus,
} from '../../../entities/maintenance-task.entity';
import { Car } from '../../../entities/car.entity';

@Injectable()
export class MaintenancePlannerService {
  constructor(
    @InjectRepository(MaintenanceRegulation)
    private readonly regulationsRepo: Repository<MaintenanceRegulation>,
    @InjectRepository(MaintenanceTask)
    private readonly tasksRepo: Repository<MaintenanceTask>,
    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,
  ) {}

  async initializeTasksForCar(car: Car): Promise<void> {
    const regulations = await this.regulationsRepo.find({
      where: { carType: car.type },
    });

    const tasks = regulations.map((regulation) =>
      this.tasksRepo.create(
        this.buildTaskPayload({
          car,
          regulation,
          currentMileage: car.mileage,
          annualMileage: car.annualMileage,
        }),
      ),
    );

    await this.tasksRepo.save(tasks);
    await this.updateCarNextMaintenance(car.id);
  }

  buildTaskPayload(params: {
    car: Car;
    regulation: MaintenanceRegulation;
    currentMileage: number;
    annualMileage: number;
  }): Partial<MaintenanceTask> {
    const dueMileage = params.currentMileage + params.regulation.intervalMiles;
    const dueDate = this.calculateDueDate({
      intervalMonths: params.regulation.intervalMonths,
      intervalMiles: params.regulation.intervalMiles,
      annualMileage: params.annualMileage,
    });

    return {
      car: params.car,
      regulation: params.regulation,
      status: MaintenanceTaskStatus.PENDING,
      dueMileage,
      dueDate,
    };
  }

  calculateDueDate(params: {
    intervalMonths: number;
    intervalMiles: number;
    annualMileage: number;
  }): Date | undefined {
    const now = new Date();
    const candidates: Date[] = [];

    if (params.intervalMonths) {
      const byMonths = new Date(now);
      byMonths.setMonth(byMonths.getMonth() + params.intervalMonths);
      candidates.push(byMonths);
    }

    if (params.intervalMiles && params.annualMileage) {
      const milesPerMonth = params.annualMileage / 12;
      if (milesPerMonth > 0) {
        const monthsForMiles = Math.round(params.intervalMiles / milesPerMonth);
        if (monthsForMiles > 0) {
          const byMileage = new Date(now);
          byMileage.setMonth(byMileage.getMonth() + monthsForMiles);
          candidates.push(byMileage);
        }
      }
    }

    return candidates.length
      ? new Date(
          Math.min.apply(
            null,
            candidates.map((date) => date.getTime()),
          ),
        )
      : undefined;
  }

  async updateCarNextMaintenance(carId: string): Promise<void> {
    const nextTask = await this.tasksRepo.findOne({
      where: { car: { id: carId }, status: MaintenanceTaskStatus.PENDING },
      order: {
        dueDate: 'ASC',
        dueMileage: 'ASC',
      },
    });

    await this.carRepo.update(carId, {
      nextMaintenanceDate: nextTask?.dueDate,
      nextMaintenanceMileage: nextTask?.dueMileage,
    });
  }
}
