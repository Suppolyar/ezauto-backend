import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkshopMember } from './workshop-member.entity';
import { WorkshopLocation } from './workshop-location.entity';
import { WorkshopCampaign } from './workshop-campaign.entity';

export enum WorkshopStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

@Entity('workshops')
export class Workshop {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  legalName!: string;

  @Column()
  brandName!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  contactEmail?: string;

  @Column({ nullable: true })
  contactPhone?: string;

  @Column({
    type: 'enum',
    enum: WorkshopStatus,
    default: WorkshopStatus.DRAFT,
  })
  status!: WorkshopStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @OneToMany(() => WorkshopMember, (member) => member.workshop)
  members!: WorkshopMember[];

  @OneToMany(() => WorkshopLocation, (location) => location.workshop)
  locations!: WorkshopLocation[];

  @OneToMany(() => WorkshopCampaign, (campaign) => campaign.workshop)
  campaigns!: WorkshopCampaign[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
