// src/location/dto/location-response.dto.ts

import { Device } from 'src/device/device.entity';
import { Status } from 'src/types/enums';
import { UserLocationDto } from 'src/user/dto/user-location.dto';

export class LocationResponseDto {
  id: number;
  title: string;
  address: string;
  status: Status;
  devices: Device[];
  user_locations: UserLocationDto[];
}
