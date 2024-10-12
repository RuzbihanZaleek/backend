import { Device } from "src/device/device.entity";
import { UserLocation } from "src/user/user-location.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 255 })
    address: string;

    @Column({ type: 'enum', enum: ['Active', 'Inactive'], default: 'Active'})
    status: 'Active' | 'InActive';

    @OneToMany(() => Device, (device) => device.location)
    devices: Device[];

    @OneToMany(() => UserLocation, (userLocation) => userLocation.location)
    user_locations: UserLocation[];
}