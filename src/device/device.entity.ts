import { Location } from "src/location/location.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('devices')
export class Device {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255, unique: true})
    serial_number: string;

    @Column({type: 'enum', enum: ['pos', 'kiosk', 'signage']})
    type: 'pos' | 'kiosk' | 'signage';

    @Column({type: 'varchar', length: 255})
    image: string;

    @Column({ type: 'enum', enum: ['Active', 'Inactive'], default: 'Active' })
    status: 'Active' | 'Inactive';

    @ManyToOne(() => Location, (location) => location.devices)
    @JoinColumn({name: 'location_id'})
    location: Location;
}