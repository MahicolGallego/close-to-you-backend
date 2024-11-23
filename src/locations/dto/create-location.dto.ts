import { IsNotEmpty, IsNumber, IsLatitude, IsLongitude } from 'class-validator';
import { Contact } from 'src/contacts/entities/contact.entity';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsNumber()
  @IsLatitude()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @IsLongitude()
  longitude: number;

  @IsNotEmpty()
  contact: Contact;
}
