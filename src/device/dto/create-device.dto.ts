import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { DeviceType, Status } from 'src/types/enums';

export class CreateDeviceDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  serial_number: string;

  @IsEnum(DeviceType)
  @IsNotEmpty()
  type: DeviceType;

  @IsUrl()
  @MaxLength(255)
  @IsNotEmpty()
  image: string;

  @IsEnum(Status)
  status?: Status;

  @IsNumber()
  @IsNotEmpty()
  locationId: number;
}
