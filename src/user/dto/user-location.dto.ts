import { IsNumber } from 'class-validator';

export class UserLocationDto {
  @IsNumber()
  user_id: number;
}
