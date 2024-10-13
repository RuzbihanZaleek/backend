import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Location } from 'src/location/location.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,

    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // Create a new device for a location
  async createDevice(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const { serial_number, type, image, status, locationId } = createDeviceDto;

    const location = await this.locationRepository.findOne({
      where: { id: locationId },
      relations: ['devices'],
    });
    if (!location) {
      throw new NotFoundException(`Location with ID ${locationId} not found`);
    }

    // Check if the location already has 10 devices
    if (location.devices.length >= 10) {
      throw new BadRequestException(
        'A location cannot have more than 10 devices',
      );
    }

    // Check if the serial number is unique
    const existingDevice = await this.deviceRepository.findOne({
      where: { serial_number },
    });
    if (existingDevice) {
      throw new ConflictException(
        'Device with this serial number already exists',
      );
    }

    const device = this.deviceRepository.create({
      serial_number,
      type,
      image,
      status,
      location,
    });

    return this.deviceRepository.save(device);
  }

  // Get all devices
  async findAll(): Promise<Device[]> {
    return await this.deviceRepository.find({
      relations: ['location'],
    });
  }

  // Get a single device by ID
  async findOneById(id: number): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { id },
      relations: ['location'],
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    return device;
  }

  // Update a device
  async updateDevice(
    id: number,
    updateDeviceDto: UpdateDeviceDto,
  ): Promise<Device> {
    const device = await this.findOneById(id);

    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    const { locationId, serial_number } = updateDeviceDto;

    // Check if locationId is provided and find the location
    if (locationId) {
      const location = await this.locationRepository.findOne({
        where: { id: locationId },
        relations: ['devices'],
      });
      if (!location) {
        throw new NotFoundException(`Location with ID ${locationId} not found`);
      }

      // Check if the location already has 10 devices
      if (location.devices.length >= 10) {
        throw new BadRequestException(
          'A location cannot have more than 10 devices',
        );
      }

      // Assign the new location to the device
      device.location = location;
    }

    // Check if the serial number is being updated and validate uniqueness
    if (serial_number) {
      const existingDevice = await this.deviceRepository.findOne({
        where: { serial_number },
      });
      if (existingDevice && existingDevice.id !== device.id) {
        throw new ConflictException(
          'Device with this serial number already exists',
        );
      }
    }

    this.deviceRepository.merge(device, updateDeviceDto);
    return this.deviceRepository.save(device);
  }

  // Delete a device by ID
  async deleteDevice(id: number): Promise<{ message: string }> {
    const device = await this.findOneById(id);
    await this.deviceRepository.remove(device); // Remove the device
    return { message: `Device with ID ${id} successfully deleted` };
  }
}
