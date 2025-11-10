import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtUserPayload } from '../../../shared/types/jwt-payload';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: {
    sub: number | string;
    email?: string;
    name?: string;
    role?: string;
  }): JwtUserPayload {
    return {
      id: Number(payload.sub),
      email: payload.email ?? '',
      name: payload.name ?? '',
      role: (payload.role as JwtUserPayload['role']) ?? UserRole.CONSUMER,
    };
  }
}
