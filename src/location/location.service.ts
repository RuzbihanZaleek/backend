import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Location } from './location.entity';
import { UserLocation } from 'src/user/user-location.entity';
import { User } from 'src/user/user.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UserLocationDto } from 'src/user/dto/user-location.dto';
import { LocationResponseDto } from 'src/user/dto/location-response.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserLocation)
    private readonly userLocationRepository: Repository<UserLocation>,
  ) {}

  // find all locations
  async findAll(): Promise<LocationResponseDto[]> {
    const locations = await this.locationRepository.find({
      relations: ['devices', 'user_locations', 'user_locations.user'],
    });

    const transformedLocations: LocationResponseDto[] = locations.map(
      (location) => {
        const transformedUserLocations: UserLocationDto[] =
          location.user_locations.map((userLocation) => ({
            user_id: userLocation.user.id,
          }));

        return {
          ...location,
          user_locations: transformedUserLocations,
        };
      },
    );

    return transformedLocations;
  }

  // find a location by passing the location id
  async findOneById(id: number): Promise<LocationResponseDto> {
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: ['devices', 'user_locations', 'user_locations.user'],
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    const transformedUserLocations: UserLocationDto[] =
      location.user_locations.map((userLocation) => ({
        user_id: userLocation.user.id,
      }));

    console.log(transformedUserLocations);

    return {
      ...location,
      user_locations: transformedUserLocations,
    };
  }

  // create location
  async createLocation(
    createLocationDto: CreateLocationDto,
  ): Promise<Location> {
    const { title, address, status = 'Active', userIds } = createLocationDto;

    const location = this.locationRepository.create({
      title,
      address,
      status: status as 'Active' | 'Inactive',
    });

    const savedLocation = await this.locationRepository.save(location);

    if (userIds && userIds.length > 0) {
      const users = await this.userRepository.find({
        where: { id: In(userIds) },
      });
      if (users.length !== userIds.length) {
        throw new NotFoundException('Some users not found');
      }

      const userLocations = users.map((user) => {
        const userLocation = new UserLocation();
        userLocation.user = user;
        userLocation.location = savedLocation;
        return userLocation;
      });

      await this.userLocationRepository.save(userLocations);
    }

    return savedLocation;
  }

  // update a location by passing the location id
  async updateLocation(
    id: number,
    updateData: Partial<Location>,
  ): Promise<Location> {
    const location = await this.locationRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    this.locationRepository.merge(location, updateData);
    return this.locationRepository.save(location);
  }

  // delete a location by passing the location id
  async deleteLocation(id: number): Promise<string> {
    const location = await this.locationRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    await this.locationRepository.remove(location);

    return `Location with ID ${id} deleted successfully`;
  }
}
