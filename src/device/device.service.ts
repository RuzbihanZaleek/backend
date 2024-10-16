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
import { MESSAGES } from 'src/common/constants/messages.constants';
import { LocationUtil } from 'src/utils/location.util';
import { DeviceType } from 'src/types/enums';

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

    const location = await LocationUtil.findLocation(
      this.locationRepository,
      { id: locationId },
      ['devices'],
    );

    // Check if the location already has 10 devices
    if (location.devices.length >= 10) {
      throw new BadRequestException(MESSAGES.ERROR.DEVICE.MORE_DEVICES);
    }

    // Check if the serial number is unique
    const existingDevice = await this.deviceRepository.findOne({
      where: { serial_number },
    });
    if (existingDevice) {
      throw new ConflictException(MESSAGES.ERROR.DEVICE.SERIAL_NUMBER_EXISTS);
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
      throw new NotFoundException(MESSAGES.ERROR.DEVICE.DEVICE_NOT_FOUND(id));
    }

    return device;
  }

  // Get devices by passing the location type
  async findByType(type: DeviceType): Promise<Device[]> {
    const devices = await this.deviceRepository.find({
      where: { type },
    });

    if (!devices || devices.length === 0) {
      throw new NotFoundException(`No devices found for type: ${type}`);
    }

    // Use Promise.all to call findOneById for each device's id
    const detailedDevices = await Promise.all(
      devices.map((device) => this.findOneById(device.id)),
    );

    return detailedDevices;
  }

  // Update a device
  async updateDevice(
    id: number,
    updateDeviceDto: UpdateDeviceDto,
  ): Promise<Device> {
    const device = await this.findOneById(id);

    if (!device) {
      throw new NotFoundException(MESSAGES.ERROR.DEVICE.DEVICE_NOT_FOUND(id));
    }

    const { locationId, serial_number } = updateDeviceDto;

    // Check if locationId is provided and find the location
    if (locationId !== null) {
      const location = await LocationUtil.findLocation(
        this.locationRepository,
        { id: locationId },
        ['devices'],
      );

      // Check if the location already has 10 devices
      if (location.devices.length >= 10) {
        throw new BadRequestException(MESSAGES.ERROR.DEVICE.MORE_DEVICES);
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
        throw new ConflictException(MESSAGES.ERROR.DEVICE.SERIAL_NUMBER_EXISTS);
      }
    }

    this.deviceRepository.merge(device, updateDeviceDto);
    return this.deviceRepository.save(device);
  }

  // Delete a device by ID
  async deleteDevice(id: number): Promise<{ message: string }> {
    const device = await this.findOneById(id);
    await this.deviceRepository.remove(device); // Remove the device
    return { message: MESSAGES.SUCCESS.DEVICE.DEVICE_DELETED };
  }

  // Soft delete a device by ID (set isDeleted to true)
  async softDeleteDevice(id: number): Promise<{ message: string }> {
    const device = await this.findOneById(id);
    device.isDeleted = true;
    await this.deviceRepository.save(device);
    return { message: MESSAGES.SUCCESS.DEVICE.DEVICE_DELETED };
  }
}
