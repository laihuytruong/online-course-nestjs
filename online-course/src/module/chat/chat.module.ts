import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './chat.repository';
import { SocketRepository } from './socket.repository';
import { UserRepository } from '../user/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat.entity';
import { User } from 'src/entities/user.entity';
import { Socket } from 'src/entities/socket.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Chat, User, Socket])],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatGateway,
    ChatRepository,
    SocketRepository,
    UserRepository,
  ],
  exports: [ChatGateway],
})
export class ChatModule {}
