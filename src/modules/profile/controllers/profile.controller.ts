import {
  Controller,
  Get,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { JwtUserPayload } from '../../../shared/types/jwt-payload';
import { ProfileResponseDto } from '../dto/profile-response.dto';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(
    @Request() req: Request & { user: JwtUserPayload },
  ): Promise<ProfileResponseDto> {
    const userId = req.user.id;

    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['cars'],
      select: ['id', 'email', 'name'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      carsCount: user.cars.length,
    };
  }
}
