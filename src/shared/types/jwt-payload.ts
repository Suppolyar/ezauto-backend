import { UserRole } from '../../modules/auth/entities/user.entity';

export interface JwtUserPayload {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}
