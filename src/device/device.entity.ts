import { Location } from "src/location/location.entity";
import { DeviceType, Status } from "src/types/enums";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('devices')
export class Device {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255, unique: true})
    serial_number: string;

    @Column({type: 'enum', enum: [DeviceType.Pos, DeviceType.Kiosk, DeviceType.Signage]})
    type: DeviceType;

    @Column({type: 'varchar', length: 255})
    image: string;

    @Column({ type: 'enum', enum: [Status.Active, Status.Inactive], default: Status.Active })
    status: Status;

    @ManyToOne(() => Location, (location) => location.devices)
    @JoinColumn({name: 'location_id'})
    location: Location;
}