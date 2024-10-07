import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(32)
  name: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
