import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(2)
  emailToken: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
