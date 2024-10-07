import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './course.entity';
import { Exclude } from 'class-transformer';
import { Chat } from './chat.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column()
  role: number;

  @Column({ name: 'type_account' })
  typeAccount: number;

  @Column({ nullable: true, name: 'refresh_token' })
  refreshToken?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true, name: 'email_token' })
  emailToken?: string;

  @OneToMany(() => Course, (course) => course.user)
  courses?: Course[];

  @OneToMany(() => Chat, (chat) => chat.fromUser)
  sentChats?: Chat[];

  @OneToMany(() => Chat, (chat) => chat.toUser)
  receivedChats?: Chat[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at?: string;
}
