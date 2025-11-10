import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkshopCampaign } from './workshop-campaign.entity';
import { WorkshopLocation } from './workshop-location.entity';
import { User } from '../modules/auth/entities/user.entity';
import { Car } from './car.entity';
import { MaintenanceTask } from './maintenance-task.entity';

export enum WorkshopCampaignRedemptionStatus {
  ISSUED = 'issued',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
}

@Entity('workshop_campaign_redemptions')
export class WorkshopCampaignRedemption {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => WorkshopCampaign, (campaign) => campaign.redemptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'campaign_id' })
  campaign!: WorkshopCampaign;

  @ManyToOne(() => WorkshopLocation, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'location_id' })
  location?: WorkshopLocation;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Car, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'car_id' })
  car?: Car;

  @ManyToOne(() => MaintenanceTask, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'maintenance_task_id' })
  maintenanceTask?: MaintenanceTask;

  @Column({
    type: 'enum',
    enum: WorkshopCampaignRedemptionStatus,
    default: WorkshopCampaignRedemptionStatus.ISSUED,
  })
  status!: WorkshopCampaignRedemptionStatus;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  discountValue?: string;

  @Column({ nullable: true })
  note?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  redeemedAt?: Date;
}
