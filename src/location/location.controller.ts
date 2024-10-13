import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './location.entity';
import { LocationResponseDto } from 'src/user/dto/location-response.dto';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async create(
    @Body() createLocationDto: CreateLocationDto,
  ): Promise<Location> {
    return this.locationService.createLocation(createLocationDto);
  }

  @Get()
  async findAll(): Promise<LocationResponseDto[]> {
    return this.locationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<LocationResponseDto> {
    return this.locationService.findOneById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    return this.locationService.updateLocation(id, updateLocationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{message: string}> {
    return this.locationService.deleteLocation(id);
  }
}
