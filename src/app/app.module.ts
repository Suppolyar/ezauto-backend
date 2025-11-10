import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CarModule } from '../modules/car/car.module';
import { ProfileModule } from '../modules/profile/profile.module';
import { MaintenanceModule } from '../modules/maintenance/maintenance.module';
import { NotificationsModule } from '../modules/notifications/notifications.module';
import { WorkshopsModule } from '../modules/workshops/workshops.module';
import { WorkshopsAdminModule } from '../modules/workshops-admin/workshops-admin.module';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl:
        (process.env.DATABASE_SSL ?? '').toLowerCase() === 'true'
          ? { rejectUnauthorized: false }
          : undefined,
      autoLoadEntities: true,
      synchronize: false,
    }),
    AuthModule,
    CarModule,
    ProfileModule,
    MaintenanceModule,
    NotificationsModule,
    WorkshopsModule,
    WorkshopsAdminModule,
  ],
})
export class AppModule {}
