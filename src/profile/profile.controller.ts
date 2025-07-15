import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategiest/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtUserPayload } from '../auth/types/jwt-payload';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  @Get()
  async getProfile(@Request() req: Request & { user: JwtUserPayload }) {
    const userId = req.user.id;

    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['cars'],
      select: ['id', 'email', 'name'],
    });

    return {
      id: user?.id,
      email: user?.email,
      name: user?.name,
      carsCount: user?.cars.length,
    };
  }
}
