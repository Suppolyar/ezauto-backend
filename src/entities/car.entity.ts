import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../modules/auth/entities/user.entity';
import { MaintenanceTask } from './maintenance-task.entity';
import { MaintenanceLog } from './maintenance-log.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  vin!: string;

  @Column({ default: 'base' })
  type!: 'base' | 'sport' | 'luxury';

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column({ nullable: true })
  year?: number;

  @Column()
  mileage!: number;

  @Column({ name: 'averageMileagePerYear' })
  annualMileage!: number;

  @Column({ type: 'jsonb', nullable: true })
  vinDecodedData?: Record<string, unknown>;

  @Column({ type: 'timestamptz', nullable: true })
  lastMileageUpdate?: Date;

  @Column({ type: 'integer', nullable: true })
  nextMaintenanceMileage?: number;

  @Column({ type: 'timestamptz', nullable: true })
  nextMaintenanceDate?: Date;

  @ManyToOne(() => User, (user) => user.cars, { eager: true })
  user!: User;

  @OneToMany(() => MaintenanceTask, (task) => task.car)
  maintenanceTasks!: MaintenanceTask[];

  @OneToMany(() => MaintenanceLog, (log) => log.car)
  maintenanceLogs!: MaintenanceLog[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
