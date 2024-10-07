import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from './user.entity';
import { Price } from './price.entity';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({ length: 60, unique: true })
  title: string;

  @Column({ length: 120, nullable: true })
  subtitle?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  videoUrl: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: false })
  userId: number;

  @Column()
  categoryId: number;

  @Column()
  subCategoryId: number;

  @Column({ nullable: true })
  priceId?: number;

  @ManyToOne(() => User, (user) => user.courses)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Category, (category) => category.courses)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'subCategoryId', referencedColumnName: 'id' })
  subCategory: Category;

  @ManyToOne(() => Price, (price) => price.courses)
  @JoinColumn({ name: 'priceId' })
  price: Price;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at?: string;
}
