import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatRepository } from './chat.repository';
import { Server } from 'socket.io';
import { SocketRepository } from './socket.repository';
import { UserRepository } from '../user/user.repository';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayConnection
{
  @WebSocketServer() io: Server;

  constructor(
    private chatRepository: ChatRepository,
    private socketRepository: SocketRepository,
    private userRepository: UserRepository,
  ) {}

  afterInit() {
    console.log('afterInit');
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    console.log(`Client id: ${client.id} connected`);
    console.log(`Number of connected clients: ${sockets.size}`);
  }

  async handleDisconnect(client: any) {
    console.log(`Client id:${client.id} disconnected`);
    await this.socketRepository.delete({
      socketId: client.id,
    });
  }

  @SubscribeMessage('join')
  handleJoinChat(client: any) {
    this.socketRepository.save({
      socketId: client.id,
    });
  }

  @SubscribeMessage('chat')
  async handleMessage(client: any, data: any) {
    console.log(`Message received from client id: ${client.id}`);
    console.log(`Payload: ${JSON.stringify(data)}`);

    const receivedSocketIds = await this.socketRepository.find({
      where: {
        socketId: data.to,
      },
    });

    const fromUser = await this.userRepository.getUserById(data.from);

    console.log('receivedSocketIds: ', receivedSocketIds);

    receivedSocketIds.forEach((receivedSocketId) => {
      this.io.sockets.to(receivedSocketId.socketId).emit('receive', {
        text: data.text,
        to: data.to,
        id: data.id,
        fromUser: {
          id: fromUser.id,
          name: fromUser.name,
          avatar: fromUser.avatar,
        },
      });
    });
  }
}
