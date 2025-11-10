import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workshop } from './workshop.entity';
import { MaintenanceRegulation } from './maintenance-regulation.entity';
import { WorkshopCampaignRedemption } from './workshop-campaign-redemption.entity';

export enum WorkshopCampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended',
}

export enum WorkshopCampaignDiscountType {
  PERCENT = 'percent',
  FIXED = 'fixed',
}

@Entity('workshop_campaigns')
export class WorkshopCampaign {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Workshop, (workshop) => workshop.campaigns, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workshop_id' })
  workshop!: Workshop;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: WorkshopCampaignDiscountType,
    default: WorkshopCampaignDiscountType.PERCENT,
  })
  discountType!: WorkshopCampaignDiscountType;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  discountValue!: string;

  @Column({ nullable: true })
  terms?: string;

  @Column({
    type: 'enum',
    enum: WorkshopCampaignStatus,
    default: WorkshopCampaignStatus.DRAFT,
  })
  status!: WorkshopCampaignStatus;

  @Column({ type: 'timestamptz', nullable: true })
  startsAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endsAt?: Date;

  @Column({ type: 'enum', enum: ['base', 'sport', 'luxury'], nullable: true })
  targetCarType?: 'base' | 'sport' | 'luxury';

  @ManyToOne(() => MaintenanceRegulation, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'target_regulation_id' })
  targetRegulation?: MaintenanceRegulation;

  @Column({ type: 'jsonb', nullable: true })
  media?: Record<string, unknown>;

  @OneToMany(
    () => WorkshopCampaignRedemption,
    (redemption) => redemption.campaign,
  )
  redemptions!: WorkshopCampaignRedemption[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
