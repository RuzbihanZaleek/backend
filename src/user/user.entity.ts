import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";
import { UserLocation } from "./user-location.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255})
    first_name: string;

    @Column({type: 'varchar', length: 255})
    last_name: string;

    @Column({type: 'varchar', length: 255, unique: true})
    email: string;

    @Column({type: 'varchar', length: 255})
    password: string;

    @ManyToOne(() => Role, role => role.id)
    @JoinColumn({name: 'role_id'})
    role_id: number;

    @OneToMany(() => UserLocation, (userLocation) => userLocation.user)
    user_locations: UserLocation[]
}