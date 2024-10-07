import { Injectable } from '@nestjs/common';
import { Chat } from 'src/entities/chat.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ChatRepository extends Repository<Chat> {
  constructor(private dataSource: DataSource) {
    super(Chat, dataSource.createEntityManager());
  }
}
