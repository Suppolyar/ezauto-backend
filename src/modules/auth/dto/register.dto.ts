import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User Email',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'securePassword123', description: 'Password' })
  @IsString()
  password!: string;

  @ApiProperty({ example: 'John Doe', description: 'User Name' })
  @IsString()
  name!: string;
}
