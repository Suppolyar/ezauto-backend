import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationSchedulerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(NotificationSchedulerService.name);
  private interval?: NodeJS.Timeout;

  constructor(private readonly notificationsService: NotificationsService) {}

  onModuleInit() {
    // Kick off immediately, then every 6 hours.
    this.runTask();
    this.interval = setInterval(() => this.runTask(), 1000 * 60 * 60 * 6);
  }

  onModuleDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private async runTask() {
    try {
      await this.notificationsService.dispatchMaintenanceReminders();
    } catch (error) {
      this.logger.error(
        `Failed to dispatch maintenance reminders: ${(error as Error).message}`,
      );
    }
  }
}
