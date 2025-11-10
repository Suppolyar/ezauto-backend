import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../../../entities/car.entity';
import {
  MaintenanceTask,
  MaintenanceTaskStatus,
} from '../../../entities/maintenance-task.entity';
import { MaintenanceLog } from '../../../entities/maintenance-log.entity';
import { MaintenancePlannerService } from './maintenance-planner.service';
import {
  WorkshopCampaignRedemption,
  WorkshopCampaignRedemptionStatus,
} from '../../../entities/workshop-campaign-redemption.entity';

interface CompleteTaskPayload {
  mileage: number;
  notes?: string;
  performedAt?: Date;
  redemptionId?: string;
}

@Injectable()
export class MaintenanceTasksService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,
    @InjectRepository(MaintenanceTask)
    private readonly tasksRepo: Repository<MaintenanceTask>,
    @InjectRepository(MaintenanceLog)
    private readonly logsRepo: Repository<MaintenanceLog>,
    @InjectRepository(WorkshopCampaignRedemption)
    private readonly redemptionRepo: Repository<WorkshopCampaignRedemption>,
    private readonly planner: MaintenancePlannerService,
  ) {}

  async getCarForUser(carId: string, userId: number): Promise<Car> {
    const car = await this.carRepo.findOne({
      where: { id: carId },
      relations: ['user'],
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    if (car.user.id !== userId) {
      throw new ForbiddenException('You do not have access to this car');
    }

    return car;
  }

  async findTasks(carId: string, userId: number) {
    await this.getCarForUser(carId, userId);

    return this.tasksRepo.find({
      where: { car: { id: carId } },
      order: {
        dueDate: 'ASC',
        dueMileage: 'ASC',
      },
    });
  }

  async findLogs(carId: string, userId: number) {
    await this.getCarForUser(carId, userId);

    return this.logsRepo.find({
      where: { car: { id: carId } },
      order: { performedAt: 'DESC' },
    });
  }

  async completeTask(params: {
    carId: string;
    userId: number;
    taskId: string;
    payload: CompleteTaskPayload;
  }): Promise<{ task: MaintenanceTask; log: MaintenanceLog }> {
    const car = await this.getCarForUser(params.carId, params.userId);

    const task = await this.tasksRepo.findOne({
      where: { id: params.taskId, car: { id: car.id } },
      relations: ['regulation'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.status = MaintenanceTaskStatus.COMPLETED;
    task.completedAt = params.payload.performedAt ?? new Date();
    task.completedMileage = params.payload.mileage;

    await this.tasksRepo.save(task);

    let redemption: WorkshopCampaignRedemption | null = null;
    if (params.payload.redemptionId) {
      redemption = await this.redemptionRepo.findOne({
        where: { id: params.payload.redemptionId, user: { id: params.userId } },
      });

      if (!redemption) {
        throw new NotFoundException('Campaign redemption not found');
      }
    }

    const log = await this.logsRepo.save(
      this.logsRepo.create({
        car,
        task,
        title: task.regulation.item,
        description: task.regulation.description,
        mileage: params.payload.mileage,
        performedAt: params.payload.performedAt ?? new Date(),
        metadata: params.payload.notes
          ? { notes: params.payload.notes }
          : undefined,
      }),
    );

    // Schedule next iteration for same regulation.
    const regulation = task.regulation;
    const nextTaskPayload = this.planner.buildTaskPayload({
      car,
      regulation,
      currentMileage: params.payload.mileage,
      annualMileage: car.annualMileage,
    });

    await this.tasksRepo.save(this.tasksRepo.create(nextTaskPayload));

    car.mileage = params.payload.mileage;
    car.lastMileageUpdate = params.payload.performedAt ?? new Date();
    await this.carRepo.save(car);
    await this.planner.updateCarNextMaintenance(car.id);

    if (redemption) {
      redemption.status = WorkshopCampaignRedemptionStatus.REDEEMED;
      redemption.maintenanceTask = task;
      redemption.car = car;
      redemption.redeemedAt = params.payload.performedAt ?? new Date();
      await this.redemptionRepo.save(redemption);
    }

    return { task, log };
  }
}
