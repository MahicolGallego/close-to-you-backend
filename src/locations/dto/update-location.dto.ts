import { IsNumber, IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class UpdateLocationDto {
  @IsNotEmpty()
  @IsNumber()
  @IsLatitude()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @IsLongitude()
  longitude: number;
}
