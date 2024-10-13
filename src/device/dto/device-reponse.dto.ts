import { Location } from 'src/location/location.entity';
import { DeviceType, Status } from 'src/types/enums';

export class DeviceResponseDto {
  id: number;
  serial_number: string;
  type: DeviceType;
  image: string;
  status: Status;
  location: Location;
}
