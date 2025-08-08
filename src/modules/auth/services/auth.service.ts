import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string }> {
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash: await bcrypt.hash(dto.password, 10),
    });

    await this.userRepo.save(user);

    return { accessToken: this.jwtService.sign({ sub: user.id }) };
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(pass, user.passwordHash);

    if (!isMatch) throw new UnauthorizedException('Invalid password');

    return {
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }
}
