import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { compareData } from 'src/utils/hash';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserByEmail(email: string, password: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const comparePassword = await compareData(password, user.password);
      if (!comparePassword) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (error) {
      console.log('error', error);
      throw new UnauthorizedException('Credentials are not valid');
    }
  }

  async getByEmailToken(emailToken: string): Promise<User> {
    try {
      const user = await this.findOne({
        where: [{ emailToken }],
      });
      return user;
    } catch (err) {
      console.log('err in getByEmailToken', err);
      throw new InternalServerErrorException('Something error query');
    }
  }
}
