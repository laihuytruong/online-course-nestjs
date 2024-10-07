import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { GetUsersDto } from './dto/get-users.dto';
import { PageMetaDto } from 'src/common/paginate/page-meta.dto';
import { PageDto } from 'src/common/paginate/paginate.dto';
import { ResponseData } from 'src/interface/response.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { compareData, hashData } from 'src/utils/hash';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private uploadService: UploadService,
  ) {}

  async getUsers(getUsersDto: GetUsersDto) {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      queryBuilder.orderBy('user.created_at', getUsersDto.order);

      if (getUsersDto.search) {
        queryBuilder.where('UPPER(user.name) LIKE UPPER(:searchQuery)', {
          searchQuery: `%${getUsersDto.search}%`,
        });
      }
      if (getUsersDto.roles) {
        queryBuilder.andWhere('user.role IN (:...roles)', {
          roles: getUsersDto.roles,
        });
      }

      queryBuilder.skip(getUsersDto.skip).take(getUsersDto.pageSize);

      const totalCounts = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      const pageMetaDto = new PageMetaDto({
        totalCounts,
        pageOptionsDto: getUsersDto,
      });
      const data = new PageDto(entities, pageMetaDto);

      const responseData: ResponseData = {
        message: 'Get users successfully',
        data,
      };
      return responseData;
    } catch (error) {
      console.log('error', error);
    }
  }

  async getUserById(userId: number): Promise<ResponseData> {
    const user = await this.userRepository.findOne({
      where: [{ id: userId }],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const responseData: ResponseData = {
      message: 'Get user successfully',
      data: user,
    };
    return responseData;
  }

  async profileByMe(userId: number): Promise<ResponseData> {
    const user = await this.userRepository.findOne({
      where: [{ id: userId }],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const responseData: ResponseData = {
      message: 'Get profile successfully',
      data: user,
    };
    return responseData;
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    userId: number,
  ): Promise<ResponseData> {
    const { old_password, new_password } = changePasswordDto;
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isCorrectPassword = await compareData(old_password, user.password);

    if (!isCorrectPassword) {
      throw new InternalServerErrorException('Old password incorrect');
    }

    const newHashPassword = await hashData(new_password);
    await this.userRepository.update(user.id, { password: newHashPassword });

    const responseData: ResponseData = {
      message: 'Change password successfully!',
    };

    return responseData;
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
    avatar: Express.Multer.File,
  ): Promise<ResponseData> {
    try {
      const user = await this.userRepository.getUserById(userId);

      if (!user) {
        throw new UnauthorizedException();
      }

      if (avatar) {
        if (user.avatar) {
          await this.uploadService.deleteResource(user.avatar);
        }
        const avatarURL = await this.uploadService.uploadResource(avatar);
        user.avatar = avatarURL;
        user.name = updateProfileDto.name ? updateProfileDto.name : user.name;
      } else {
        user.name = updateProfileDto.name ? updateProfileDto.name : user.name;
      }
      this.userRepository.save(user);

      const responseData: ResponseData = {
        message: 'Update profile successfully!',
        data: user,
      };

      return responseData;
    } catch (error) {
      console.log('error: ', error);
      throw new InternalServerErrorException(error);
    }
  }
}
