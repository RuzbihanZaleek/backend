import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Status } from 'src/types/enums';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsArray()
  @IsNumber({}, { each: true })
  userIds: number[];
}
