import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { ResponseData } from 'src/interface/response.interface';
import { Chat } from 'src/entities/chat.entity';
import { ChatRepository } from './chat.repository';
import { UserRepository } from '../user/user.repository';
import { ChatChannelShow, ChatDetailShow } from 'src/constants/chat';
import { GetChatDetailDto } from './dto/get-chat-detail.dto';
import { Order } from 'src/constants/paginate';
import { PageMetaDto } from 'src/common/paginate/page-meta.dto';
import { PageDto } from 'src/common/paginate/paginate.dto';
import { GetChatChannelDto } from './dto/get-chat-channel.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getChatsDetail(
    getChatDetailDto: GetChatDetailDto,
    userId: number,
  ): Promise<ResponseData> {
    const { to, page, pageSize, skip } = getChatDetailDto;

    const user = await this.userRepository.getUserById(to);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const queryBuilder = this.chatRepository.createQueryBuilder('chats');
    queryBuilder
      .leftJoinAndSelect('chats.fromUser', 'fromUser')
      .leftJoinAndSelect('chats.toUser', 'toUser')
      .where(
        '(chats.fromUserId = :user1 AND chats.toUserId = :user2) OR (chats.fromUserId = :user2 AND chats.toUserId = :user1)',
        {
          user1: userId,
          user2: to,
        },
      )
      .orderBy('chats.created_at', Order.DESC);

    const totalCounts = await queryBuilder.getCount();

    queryBuilder.skip(skip).take(pageSize);

    const { entities: chats } = await queryBuilder.getRawAndEntities();

    const pageMetaDeto = new PageMetaDto({
      totalCounts,
      pageOptionsDto: {
        page,
        pageSize,
        skip,
        order: Order.DESC,
      },
    });

    const chatDetailShow: ChatDetailShow[] = [];

    chats.forEach((chat) => {
      chatDetailShow.push({
        id: chat.id,
        text: chat.text,
        createdAt: chat.created_at,
        fromUser: {
          id: chat.fromUser.id,
          name: chat.fromUser.name,
          avatar: chat.fromUser.avatar,
        },
        toUser: {
          id: chat.toUser.id,
          name: chat.toUser.name,
          avatar: chat.toUser.avatar,
        },
      });
    });

    const data = new PageDto(chatDetailShow, pageMetaDeto);

    const responseData: ResponseData = {
      message: 'Get chats successfully!',
      data,
    };

    return responseData;
  }

  async getChatsChannel(
    getChatChannelDto: GetChatChannelDto,
    userId: number,
  ): Promise<ResponseData> {
    const { skip, pageSize, page } = getChatChannelDto;

    const subQuery = this.chatRepository
      .createQueryBuilder('chats')
      .select([
        'LEAST(chats.fromUserId, chats.toUserId) AS user1',
        'GREATEST(chats.fromUserId, chats.toUserId) AS user2',
        'MAX(chats.created_at) AS latest_message_time',
      ])
      .groupBy('user1, user2');

    const mainQuery = this.chatRepository
      .createQueryBuilder('chats')
      .innerJoin(
        '(' + subQuery.getQuery() + ')',
        'lm',
        'LEAST(chats.fromUserId, chats.toUserId) = lm.user1 AND GREATEST(chats.fromUserId, chats.toUserId) = lm.user2 AND chats.created_at = lm.latest_message_time',
      )
      .setParameters(subQuery.getParameters())
      .leftJoinAndSelect('chats.toUser', 'toUser') // Include related user data
      .leftJoinAndSelect('chats.fromUser', 'fromUser') // Include related user data
      .where('chats.fromUserId = :userId OR chats.toUserId = :userId', {
        userId: userId,
      })
      .orderBy('chats.created_at', 'DESC');

    const totalCounts = await mainQuery.getCount();

    mainQuery.skip(skip).take(pageSize);

    const { entities: chatsChannel } = await mainQuery.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      totalCounts,
      pageOptionsDto: {
        page,
        pageSize,
        skip,
        order: Order.DESC,
      },
    });

    const chatChannelShows: ChatChannelShow[] = [];

    chatsChannel.forEach((chat) => {
      chatChannelShows.push({
        id: chat.id,
        user: {
          id: chat.toUser.id === userId ? chat.fromUser.id : chat.toUser.id,
          name:
            chat.toUser.id === userId ? chat.fromUser.name : chat.toUser.name,
          avatar:
            chat.toUser.id === userId
              ? chat.fromUser.avatar
              : chat.toUser.avatar,
        },
        latestMessage: {
          text: chat.text,
          user: {
            id: chat.fromUser.id,
            name: chat.fromUser.name,
            avatar: chat.fromUser.avatar,
          },
          createdAt: chat.created_at,
        },
      });
    });

    const data = new PageDto(chatChannelShows, pageMetaDto);

    const responseData: ResponseData = {
      message: 'Get chats channel successfully!',
      data,
    };

    return responseData;
  }

  async createMessage(
    createMessageDto: CreateMessageDto,
    userId: number,
  ): Promise<ResponseData> {
    const { to, text } = createMessageDto;

    const chat: Chat = await this.chatRepository.save({
      fromUserId: userId,
      toUserId: to,
      text,
    });

    const chatRelations = await this.chatRepository.findOne({
      where: { id: chat.id },
      relations: ['fromUser', 'toUser'],
    });

    const data: ChatDetailShow = {
      id: chatRelations.id,
      text: chatRelations.text,
      createdAt: chatRelations.created_at,
      fromUser: {
        id: chatRelations.fromUser.id,
        name: chatRelations.fromUser.name,
        avatar: chatRelations.fromUser.avatar,
      },
      toUser: {
        id: chatRelations.toUser.id,
        name: chatRelations.toUser.name,
        avatar: chatRelations.toUser.avatar,
      },
    };

    const responseData: ResponseData = {
      message: 'Create message successfully!',
      data,
    };

    return responseData;
  }
}
