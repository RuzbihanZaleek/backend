import { Device } from 'src/device/device.entity';
import { Status } from 'src/types/enums';
import { UserLocation } from 'src/user/user-location.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  address: string;

  @Column({
    type: 'enum',
    enum: [Status.Active, Status.Inactive],
    default: Status.Active,
  })
  status: Status;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @OneToMany(() => Device, (device) => device.location)
  devices: Device[];

  @OneToMany(() => UserLocation, (userLocation) => userLocation.location)
  user_locations: UserLocation[];
}
