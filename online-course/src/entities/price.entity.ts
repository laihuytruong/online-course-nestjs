import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './course.entity';

@Entity({ name: 'prices' })
export class Price {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({ unique: true })
  tier: string;

  @Column({ type: 'float' })
  value: number;

  @OneToMany(() => Course, (course) => course.price)
  courses?: Course[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at?: string;
}
