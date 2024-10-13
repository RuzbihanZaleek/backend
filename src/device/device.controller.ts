import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './device.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/role/guards/roles.guard';
import { Roles } from 'src/role/decorator/roles.decorator';
import { Role } from 'src/types/roles.enum';
import { DeviceType } from 'src/types/enums';
import { MESSAGES } from 'src/common/constants/messages.constants';

@Controller('devices')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  // Create a new device for a specific location
  @Roles(Role.SuperAdmin, Role.Admin)
  @Post()
  async createDevice(
    @Body() createDeviceDto: CreateDeviceDto,
  ): Promise<Device> {
    return this.deviceService.createDevice(createDeviceDto);
  }

  // Get all devices
  @Get()
  async findAll(): Promise<Device[]> {
    return this.deviceService.findAll();
  }

  // Get devices by type
  @Get('by-type')
  async findByType(
    @Query('type', new ValidationPipe({ transform: true, whitelist: true }))
    type: DeviceType,
  ): Promise<Device[]> {
    if (!Object.values(DeviceType).includes(type)) {
      throw new BadRequestException(
        MESSAGES.ERROR.DEVICE.DEVICE_TYPE_NOT_FOUND(type),
      );
    }

    return this.deviceService.findByType(type);
  }

  // Get a specific device by ID
  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<Device> {
    return this.deviceService.findOneById(id);
  }

  // Update a device by ID
  @Roles(Role.SuperAdmin, Role.Admin)
  @Patch(':id')
  async updateDevice(
    @Param('id') id: number,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ): Promise<Device> {
    return this.deviceService.updateDevice(id, updateDeviceDto);
  }

  // Delete a device by ID
  @Roles(Role.SuperAdmin)
  @Delete(':id')
  async deleteDevice(@Param('id') id: number): Promise<{ message: string }> {
    return this.deviceService.deleteDevice(id);
  }

  @Roles(Role.SuperAdmin, Role.Admin)
  @Patch('soft_delete/:id')
  async softDeleteDevice(
    @Param('id') id: number,
  ): Promise<{ message: string }> {
    return this.deviceService.softDeleteDevice(id);
  }
}
