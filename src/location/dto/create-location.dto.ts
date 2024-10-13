import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MESSAGES } from 'src/common/constants/messages.constants';
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

  @IsArray({ message: MESSAGES.ERROR.VALIDATION.ARRAY_OF_NUMBERS })
  @ArrayNotEmpty({ message: MESSAGES.ERROR.VALIDATION.EMPTY_ARRAY })
  @IsNumber({}, { each: true, message: MESSAGES.ERROR.VALIDATION.ARRAY_OF_NUMBERS })
  userIds: number[];
}
