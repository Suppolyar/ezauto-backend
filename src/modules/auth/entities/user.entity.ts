import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Car } from '../../../entities/car.entity';

export enum UserRole {
  CONSUMER = 'consumer',
  WORKSHOP_ADMIN = 'workshop_admin',
  TOWING_DRIVER = 'towing_driver',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role_enum',
    default: UserRole.CONSUMER,
  })
  role!: UserRole;

  @OneToMany(() => Car, (car) => car.user)
  cars!: Car[];
}
