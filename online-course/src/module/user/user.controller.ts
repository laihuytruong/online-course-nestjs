import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  HttpStatus,
  HttpCode,
  UseFilters,
  UseInterceptors,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { plainToInstance } from 'class-transformer';
import { Public } from 'src/decorators/public.decorator';
import { ResponseData } from 'src/interface/response.interface';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { HttpExceptionValidateFilter } from 'src/filter/http-exception.filter';
import { ChangePasswordDto } from './dto/change-password.dto';
import { TransformInterceptor } from 'src/response/custom';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerImageOptions } from './multer.config';

@Controller('users')
@UseFilters(new HttpExceptionValidateFilter())
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetCurrentUserId() userId: number,
  ): Promise<ResponseData> {
    return this.userService.changePassword(changePasswordDto, userId);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  profileByMe(@GetCurrentUserId() userId: number): Promise<ResponseData> {
    return this.userService.profileByMe(userId);
  }

  @Put('me')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('avatar', multerImageOptions))
  updateProfile(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
    @GetCurrentUserId() userId: number,
  ): Promise<ResponseData> {
    console.log('userId: ', userId);
    return this.userService.updateProfile(userId, updateProfileDto, avatar);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getUsers(@Query() query: Record<string, any>) {
    const getUsersDto = plainToInstance(GetUsersDto, query);

    return this.userService.getUsers(getUsersDto);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserById(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<ResponseData> {
    return this.userService.getUserById(userId);
  }
}
