import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  parentId?: number;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
  parent?: Category;

  @OneToMany(() => Category, (category) => category.parent, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  children?: Category[];

  @OneToMany(() => Course, (course) => course.category)
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
