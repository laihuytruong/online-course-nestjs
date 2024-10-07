import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { ResponseData } from 'src/interface/response.interface';
import { GetChatDetailDto } from './dto/get-chat-detail.dto';
import { GetChatChannelDto } from './dto/get-chat-channel.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getChatsDetail(
    @Query() getChatDetailDto: GetChatDetailDto,
    @GetCurrentUserId() userId: number,
  ): Promise<ResponseData> {
    return this.chatService.getChatsDetail(getChatDetailDto, userId);
  }

  @Get('channel')
  @HttpCode(HttpStatus.OK)
  getChatsChannel(
    @Query() getChatChannelDto: GetChatChannelDto,
    @GetCurrentUserId() userId: number,
  ): Promise<ResponseData> {
    return this.chatService.getChatsChannel(getChatChannelDto, userId);
  }

  @Post('message')
  @HttpCode(HttpStatus.CREATED)
  createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @GetCurrentUserId() userId: number,
  ): Promise<ResponseData> {
    return this.chatService.createMessage(createMessageDto, userId);
  }
}
