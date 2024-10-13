import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Location } from './location.entity';
import { UserLocation } from 'src/user/user-location.entity';
import { User } from 'src/user/user.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UserLocationDto } from 'src/user/dto/user-location.dto';
import { LocationResponseDto } from 'src/user/dto/location-response.dto';
import { MESSAGES } from 'src/common/constants/messages.constants';
import { LocationUtil } from 'src/utils/location.util';

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

  // Get all locations
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

  // Get a location by passing the location id
  async findOneById(id: number): Promise<LocationResponseDto> {
    const location = await LocationUtil.findLocation(
      this.locationRepository,
      { id: id },
      ['devices', 'user_locations', 'user_locations.user'],
      MESSAGES.ERROR.LOCATION.LOCATION_ID_NOT_FOUND(id),
    );

    const transformedUserLocations: UserLocationDto[] =
      location.user_locations.map((userLocation) => ({
        user_id: userLocation.user.id,
      }));

    return {
      ...location,
      user_locations: transformedUserLocations,
    };
  }

  // Create location
  async createLocation(
    createLocationDto: CreateLocationDto,
  ): Promise<Location> {
    const { title, address, status, userIds } = createLocationDto;

    // Check if a location with the same address already exists
    await LocationUtil.checkIfLocationExists(this.locationRepository, {
      address,
    });

    const users = await this.userRepository.find({
      where: { id: In(userIds) },
    });
    if (users.length !== userIds.length) {
      throw new NotFoundException(MESSAGES.ERROR.VALIDATION.USERS_NOT_FOUND);
    }

    const location = this.locationRepository.create({
      title,
      address,
      status,
    });

    const savedLocation = await this.locationRepository.save(location);

    const userLocations = users.map((user) => {
      const userLocation = new UserLocation();
      userLocation.user = user;
      userLocation.location = savedLocation;
      return userLocation;
    });

    await this.userLocationRepository.save(userLocations);

    return savedLocation;
  }

  // Update a location by passing the location id
  async updateLocation(
    id: number,
    updateData: Partial<Location>,
  ): Promise<Location> {
    const location = await LocationUtil.findLocation(this.locationRepository, {
      id: id,
    });

    const address = updateData.address;

    // Check if the updated address already exists in another location
    if (address && address !== location.address) {
      // Check if a location with the same address already exists
      await LocationUtil.checkIfLocationExists(this.locationRepository, {
        address,
      });
    }

    this.locationRepository.merge(location, updateData);
    return this.locationRepository.save(location);
  }

  // Delete a location by passing the location id
  async deleteLocation(id: number): Promise<{ message: string }> {
    const location = await LocationUtil.findLocation(this.locationRepository, {
      id: id,
    });

    await this.locationRepository.remove(location);

    return { message: MESSAGES.SUCCESS.LOCATION.LOCATION_DELETED };
  }
}
