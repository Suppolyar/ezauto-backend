import { Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ProfileController],
})
export class ProfileModule {}
