import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'chats' })
export class Chat {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({ nullable: false })
  fromUserId?: number;

  @Column({ nullable: false })
  toUserId?: number;

  @ManyToOne(() => User, (user) => user.sentChats)
  @JoinColumn({ name: 'fromUserId' })
  fromUser: User;

  @ManyToOne(() => User, (user) => user.receivedChats)
  @JoinColumn({ name: 'toUserId' })
  toUser: User;

  @Column({ type: 'varchar', nullable: false })
  text: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at?: string;
}
