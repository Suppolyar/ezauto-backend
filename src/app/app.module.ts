import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Car } from '../entities/car.entity';
import { CarModule } from '../car/car.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: __dirname + '/../../db.sqlite',
      entities: [User, Car],
      synchronize: true,
    }),
    AuthModule,
    CarModule
  ],
})
export class AppModule {}
