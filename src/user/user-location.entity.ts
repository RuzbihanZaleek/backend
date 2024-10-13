import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Location } from 'src/location/location.entity';

@Entity('user_locations')
export class UserLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.user_locations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Location, (location) => location.user_locations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'location_id' })
  location: Location;
}
