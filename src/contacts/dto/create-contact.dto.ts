import {
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  Length,
  IsLongitude,
  IsNumber,
  IsLatitude,
  IsNumberString,
} from 'class-validator';
import { ContactType } from 'src/common/constants/contact-type.enum';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  name: string;

  @IsNotEmpty()
  @IsNumberString() // validate that the string is a number string
  @Length(7, 15)
  phone: string;

  @IsOptional()
  @IsEmail()
  @Length(10, 30)
  email: string;

  @IsNotEmpty()
  @IsEnum(ContactType)
  type: ContactType;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsNumber()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @IsLongitude()
  longitude?: number;
}
