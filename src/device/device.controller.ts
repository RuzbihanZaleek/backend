import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './device.entity';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  // Create a new device for a specific location
  @Post()
  async createDevice(
    @Body() createDeviceDto: CreateDeviceDto,
    @Query('locationId') locationId: number,
  ): Promise<Device> {
    return this.deviceService.createDevice(createDeviceDto);
  }

  // Get all devices
  @Get()
  async findAll(): Promise<Device[]> {
    return this.deviceService.findAll();
  }

  // Get a specific device by ID
  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<Device> {
    return this.deviceService.findOneById(id);
  }

  // Update a device by ID
  @Patch(':id')
  async updateDevice(
    @Param('id') id: number,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ): Promise<Device> {
    return this.deviceService.updateDevice(id, updateDeviceDto);
  }

  // Delete a device by ID
  @Delete(':id')
  async deleteDevice(@Param('id') id: number): Promise<{ message: string }> {
    return this.deviceService.deleteDevice(id);
  }
}
