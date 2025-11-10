import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Notification,
  NotificationStatus,
  NotificationType,
} from '../../../entities/notification.entity';
import { PushToken } from '../../../entities/push-token.entity';
import {
  MaintenanceTask,
  MaintenanceTaskStatus,
} from '../../../entities/maintenance-task.entity';
import { User } from '../../auth/entities/user.entity';
import { RegisterPushTokenDto } from '../dto/register-push-token.dto';
import { PushService } from './push.service';
import { WorkshopOffersService } from '../../workshops/services/workshop-offers.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
    @InjectRepository(PushToken)
    private readonly pushTokenRepo: Repository<PushToken>,
    @InjectRepository(MaintenanceTask)
    private readonly maintenanceTasksRepo: Repository<MaintenanceTask>,
    private readonly pushService: PushService,
    private readonly workshopOffersService: WorkshopOffersService,
  ) {}

  list(userId: number) {
    return this.notificationsRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async registerPushToken(userId: number, dto: RegisterPushTokenDto) {
    let token = await this.pushTokenRepo.findOne({
      where: { token: dto.token },
      relations: ['user'],
    });

    if (token) {
      token.user = { id: userId } as User;
      token.platform = dto.platform;
      token.lastActiveAt = new Date();
    } else {
      token = this.pushTokenRepo.create({
        token: dto.token,
        platform: dto.platform,
        user: { id: userId } as User,
        lastActiveAt: new Date(),
      });
    }

    return this.pushTokenRepo.save(token);
  }

  async dispatchMaintenanceReminders(): Promise<number> {
    const now = new Date();

    const dueTasks = await this.maintenanceTasksRepo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.car', 'car')
      .leftJoinAndSelect('car.user', 'user')
      .leftJoinAndSelect('task.regulation', 'regulation')
      .where('task.status = :status', {
        status: MaintenanceTaskStatus.PENDING,
      })
      .andWhere(
        '(task.dueDate IS NOT NULL AND task.dueDate <= :now) OR (task.dueMileage IS NOT NULL AND task.dueMileage <= car.mileage)',
        { now },
      )
      .getMany();

    let sent = 0;

    for (const task of dueTasks) {
      const existing = await this.notificationsRepo.findOne({
        where: { sourceId: task.id },
      });

      if (existing) {
        continue;
      }

      const offers = await this.workshopOffersService.getOffersForTask(task, 3);

      const notification = await this.notificationsRepo.save(
        this.notificationsRepo.create({
          user: task.car.user,
          type: NotificationType.MAINTENANCE_DUE,
          payload: {
            taskId: task.id,
            carId: task.car.id,
            item: task.regulation.item,
            dueDate: task.dueDate,
            dueMileage: task.dueMileage,
            offers: offers.map((offer) => ({
              campaignId: offer.campaignId,
              workshopName: offer.workshopName,
              discountType: offer.discountType,
              discountValue: offer.discountValue,
            })),
          },
          sourceId: task.id,
          scheduledAt: now,
        }),
      );

      const tokens = await this.pushTokenRepo.find({
        where: { user: { id: task.car.user.id } },
      });

      const result = await this.pushService.send(
        tokens.map((token) => token.token),
        {
          title: 'Maintenance reminder',
          body: `${task.regulation.item} is due for ${task.car.brand} ${task.car.model}`,
          data: notification.payload,
        },
      );

      notification.status = result.success
        ? NotificationStatus.SENT
        : NotificationStatus.FAILED;
      notification.sentAt = result.success ? new Date() : undefined;
      if (!result.success) {
        notification.error = 'Push send failed';
      }

      await this.notificationsRepo.save(notification);

      if (result.success) {
        sent += 1;
      }
    }

    if (sent) {
      this.logger.log(`Sent ${sent} maintenance reminders`);
    }

    return sent;
  }
}
