import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';
import { Workshop } from './workshop.entity';

@Entity('workshop_locations')
@Unique(['qrSlug'])
export class WorkshopLocation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Workshop, (workshop) => workshop.locations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workshop_id' })
  workshop!: Workshop;

  @Column()
  title!: string;

  @Column()
  address!: string;

  @Column({ type: 'double precision' })
  latitude!: number;

  @Column({ type: 'double precision' })
  longitude!: number;

  @Column({ nullable: true })
  timezone?: string;

  @Column({ default: false })
  isPrimary!: boolean;

  @Column()
  qrSlug!: string;

  @Column({ type: 'jsonb', nullable: true })
  businessHours?: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  servicesOffered?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  ensureQrSlug() {
    if (!this.qrSlug) {
      this.qrSlug = randomUUID();
    }
  }
}
