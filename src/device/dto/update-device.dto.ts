import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { DeviceType, Status } from 'src/types/enums';

export class UpdateDeviceDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  serial_number?: string;

  @IsEnum(DeviceType)
  @IsOptional()
  type?: DeviceType;

  @IsUrl()
  @MaxLength(255)
  @IsOptional()
  image?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsNumber()
  @IsOptional()
  locationId?: number;
}
