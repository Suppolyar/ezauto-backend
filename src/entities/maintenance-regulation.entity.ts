import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MaintenanceTask } from './maintenance-task.entity';

@Entity('maintenance_regulations')
export class MaintenanceRegulation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  carType!: 'base' | 'sport' | 'luxury';

  @Column()
  item!: string;

  @Column()
  intervalMiles!: number;

  @Column()
  intervalMonths!: number;

  @Column()
  description!: string;

  @Column({ nullable: true })
  severity?: 'low' | 'medium' | 'high';

  @OneToMany(() => MaintenanceTask, (task) => task.regulation)
  tasks!: MaintenanceTask[];
}
