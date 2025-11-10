import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../../entities/notification.entity';
import { PushToken } from '../../entities/push-token.entity';
import { MaintenanceTask } from '../../entities/maintenance-task.entity';
import { NotificationsService } from './services/notifications.service';
import { PushService } from './services/push.service';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationSchedulerService } from './services/notification-scheduler.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, PushToken, MaintenanceTask])],
  controllers: [NotificationsController],
  providers: [NotificationsService, PushService, NotificationSchedulerService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
