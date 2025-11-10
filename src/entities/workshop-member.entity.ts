import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Workshop } from './workshop.entity';
import { User } from '../modules/auth/entities/user.entity';

export enum WorkshopMemberRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  STAFF = 'staff',
}

@Entity('workshop_members')
@Unique(['workshop', 'user'])
export class WorkshopMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Workshop, (workshop) => workshop.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workshop_id' })
  workshop!: Workshop;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({
    type: 'enum',
    enum: WorkshopMemberRole,
    default: WorkshopMemberRole.MANAGER,
  })
  role!: WorkshopMemberRole;

  @CreateDateColumn()
  createdAt!: Date;
}
