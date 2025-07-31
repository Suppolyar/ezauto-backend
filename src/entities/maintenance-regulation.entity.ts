import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('maintenance_regulations')
export class MaintenanceRegulation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  carType: 'base' | 'sport' | 'luxury';

  @Column()
  item: string;

  @Column()
  intervalMiles: number;

  @Column()
  intervalMonths: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  severity?: 'low' | 'medium' | 'high';
}
