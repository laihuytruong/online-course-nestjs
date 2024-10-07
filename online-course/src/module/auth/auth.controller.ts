import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseData } from 'src/interface/response.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/decorators/public.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { HttpExceptionValidateFilter } from 'src/filter/http-exception.filter';
import { LoginGoogleDto } from './dto/login-google.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
@UseFilters(new HttpExceptionValidateFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createUserDto: CreateUserDto): Promise<ResponseData> {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto): Promise<ResponseData> {
    return this.authService.login(loginUserDto);
  }

  @Public()
  @Post('login-google')
  @HttpCode(HttpStatus.OK)
  loginGoogle(@Body() loginGoogleDto: LoginGoogleDto): Promise<ResponseData> {
    return this.authService.loginGoogle(loginGoogleDto);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ResponseData> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResponseData> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
