import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Length(10, 30)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 30)
  password: string;
}
