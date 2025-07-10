import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import {User} from './user.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  vin!: string;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column()
  year!: number;

  @Column()
  mileage!: number;

  @Column()
  averageMileagePerYear!: number;

  @ManyToOne(() => User, user => user.cars, { eager: true })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
