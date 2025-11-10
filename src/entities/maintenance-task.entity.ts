import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Car } from './car.entity';
import { MaintenanceRegulation } from './maintenance-regulation.entity';

export enum MaintenanceTaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

@Entity('maintenance_tasks')
export class MaintenanceTask {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Car, (car) => car.maintenanceTasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'car_id' })
  car!: Car;

  @ManyToOne(
    () => MaintenanceRegulation,
    (regulation) => regulation.tasks,
    { eager: true },
  )
  @JoinColumn({ name: 'regulation_id' })
  regulation!: MaintenanceRegulation;

  @Column({
    type: 'enum',
    enum: MaintenanceTaskStatus,
    default: MaintenanceTaskStatus.PENDING,
  })
  status!: MaintenanceTaskStatus;

  @Column({ type: 'timestamptz', nullable: true })
  dueDate?: Date;

  @Column({ type: 'integer', nullable: true })
  dueMileage?: number;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt?: Date;

  @Column({ type: 'integer', nullable: true })
  completedMileage?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
