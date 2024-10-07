import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseData } from 'src/interface/response.interface';
import { hashData } from 'src/utils/hash';
import {
  ACCOUNT_GOOGLE,
  ACCOUNT_NORMAL,
  DEFAULT_ROLE,
} from 'src/constants/user';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRegister } from 'src/response/user';
import { UserRepository } from '../user/user.repository';
import { Tokens } from './interface/token.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginGoogleDto } from './dto/login-google.dto';
import { GoogleAuthenticationService } from '../google/google.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailTokenPayload } from './interface/email-token.interface';
import { MailForgot } from 'src/interface/mail.interface';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private googleAuthenticationService: GoogleAuthenticationService,
    private mailService: MailService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<ResponseData> {
    try {
      const { name, email, password } = createUserDto;
      const hashedPassword = await hashData(password);

      const data: User = {
        email,
        password: hashedPassword,
        name,
        typeAccount: ACCOUNT_NORMAL,
        role: DEFAULT_ROLE,
      };

      const user = this.usersRepository.create(data);
      const userCreated = await this.usersRepository.save(user);

      const tokens = await this.getTokens(user.id, user.email);

      await this.usersRepository.update(userCreated.id, {
        refreshToken: tokens.refresh_token,
      });

      const updatedUser = await this.usersRepository.getUserById(
        userCreated.id,
      );

      const userRegisterData: UserRegister = {
        token: tokens.access_token,
        user: updatedUser,
      };

      const responseData: ResponseData = {
        message: 'User registered successfully',
        data: userRegisterData,
      };

      return responseData;
    } catch (error) {
      console.log('error: ', error);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<ResponseData> {
    const user: User = await this.usersRepository.getUserByEmail(
      loginUserDto.email,
      loginUserDto.password,
    );

    const tokens = await this.getTokens(user.id, user.email);
    const userRegisterData: UserRegister = {
      token: tokens.access_token,
      user,
    };

    const responseData: ResponseData = {
      data: userRegisterData,
      message: 'Login successfully',
    };

    return responseData;
  }

  async loginGoogle(loginGoogleDto: LoginGoogleDto): Promise<ResponseData> {
    const { token } = loginGoogleDto;

    try {
      const dataInfo =
        await this.googleAuthenticationService.authenticate(token);

      let user = await this.usersRepository.findOne({
        where: {
          email: dataInfo.email,
        },
      });
      let tokens;

      if (!user) {
        user = {
          email: dataInfo.email,
          name: dataInfo.name,
          password: '',
          typeAccount: ACCOUNT_GOOGLE,
          role: DEFAULT_ROLE,
        };

        const userCreated = await this.usersRepository.save(user);

        tokens = await this.getTokens(userCreated.id, userCreated.email);

        await this.usersRepository.update(userCreated.id, {
          refreshToken: tokens.refresh_token,
        });

        user = await this.usersRepository.getUserById(userCreated.id);
      } else {
        tokens = await this.getTokens(user.id, user.email);
      }

      const useRegisterData: UserRegister = {
        token: tokens.access_token,
        user: user,
      };

      const responseData: ResponseData = {
        message: 'Login google user successfully!',
        data: useRegisterData,
      };

      return responseData;
    } catch (error) {
      console.log('Error: ', error);
      throw new InternalServerErrorException('Login google failed');
    }
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ResponseData> {
    const { email } = forgotPasswordDto;

    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      const responseData: ResponseData = {
        message: 'Email is not a registered user',
      };

      return responseData;
    }

    if (user.typeAccount !== ACCOUNT_NORMAL) {
      throw new BadRequestException(
        'Forgot password only available for normal account',
      );
    }

    const emailToken = await this.encodeJWTEmail(user.email);

    user.emailToken = emailToken;

    await this.usersRepository.save(user);

    const emailData: MailForgot = {
      email: user.email,
      name: user.name,
      urlRedirect:
        this.configService.get('HOST_RESET_EMAIl_FE') +
        `/reset-password/email=${emailToken}`,
    };

    const data = await this.mailService.sendEmailForgotPassword(emailData);

    try {
      const responseData: ResponseData = {
        message: 'Send email forgot password successfully',
        data,
      };

      return responseData;
    } catch {
      throw new InternalServerErrorException(
        'Failed to send forgot password email',
      );
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResponseData> {
    const { emailToken, password } = resetPasswordDto;

    const user = await this.usersRepository.getByEmailToken(emailToken);

    if (!user) {
      throw new BadRequestException('Email token invalid');
    }

    if (user.typeAccount != ACCOUNT_NORMAL) {
      throw new BadRequestException(
        'Reset password only available for normal account',
      );
    }

    const token = await this.decodeJWTEmail(emailToken);
    if (!token) {
      throw new BadRequestException('Email token invalid');
    }

    const passwordHash = await hashData(password);

    user.password = passwordHash;
    user.emailToken = null;

    await this.usersRepository.save(user);

    const responseData: ResponseData = {
      message: 'Reset successfully!',
    };

    return responseData;
  }

  async encodeJWTEmail(email: string): Promise<string> {
    const HOUR_SECONDS = 60 * 60;

    const token = await this.jwtService.signAsync(
      {
        sub: email,
      },
      {
        secret: this.configService.get('JWT_EMAIL_SECRET'),
        expiresIn: HOUR_SECONDS,
      },
    );

    return token;
  }

  async decodeJWTEmail(emailToken: string): Promise<EmailTokenPayload | null> {
    try {
      const data = await this.jwtService.verifyAsync(emailToken, {
        secret: this.configService.get('JWT_EMAIL_SECRET'),
      });

      return data;
    } catch (error) {
      console.log('Error in decodeJWTEmail', error);
      return null;
    }
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const ACCESS_DAY_SECONDS = 60 * 60 * 24;
    const REFRESH_WEEK_SECONDS = 60 * 60 * 7 * 24;
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: ACCESS_DAY_SECONDS,
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: REFRESH_WEEK_SECONDS,
      },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
