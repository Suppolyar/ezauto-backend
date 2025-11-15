import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('car_type_rules')
export class CarTypeRule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'character varying' })
  carType!: 'base' | 'sport' | 'luxury';

  @Column({ type: 'character varying', nullable: true })
  makePattern?: string | null;

  @Column({ type: 'character varying', nullable: true })
  modelPattern?: string | null;

  @Column({ type: 'character varying', nullable: true })
  bodyClassPattern?: string | null;

  @Column({ type: 'integer', default: 100 })
  priority!: number;
}
