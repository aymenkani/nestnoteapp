import { IsEmail, MinLength } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;

  @MinLength(3)
  password: string;
}
