import { NotFoundException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Location } from 'src/location/location.entity';
import { MESSAGES } from 'src/common/constants/messages.constants';

export class LocationUtil {
  // Common function to find a location by criteria
  static async findLocation(
    locationRepository: Repository<Location>,
    criteria: Partial<Location>,
    relations: string[] = [],
    notFoundMessage: string = MESSAGES.ERROR.LOCATION.LOCATION_ID_NOT_FOUND(criteria.id),
  ): Promise<Location> {
    const location = await locationRepository.findOne({
      where: criteria,
      relations,
    });

    if (!location) {
      throw new NotFoundException(notFoundMessage);
    }

    return location;
  }

  // Function to check if a location already exists by a certain field
  static async checkIfLocationExists(
    locationRepository: Repository<Location>,
    criteria: Partial<Location>,
    conflictMessage: string = MESSAGES.ERROR.LOCATION.LOCATION_ALREADY_EXISTS,
  ): Promise<void> {
    const existingLocation = await locationRepository.findOne({
      where: criteria,
    });

    if (existingLocation) {
      throw new ConflictException(conflictMessage);
    }
  }
}
