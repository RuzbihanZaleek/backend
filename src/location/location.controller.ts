import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './location.entity';
import { LocationResponseDto } from 'src/location/dto/location-response.dto';
import { Roles } from 'src/role/decorator/roles.decorator';
import { Role } from 'src/types/roles.enum';
import { RolesGuard } from 'src/role/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('locations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Roles(Role.SuperAdmin, Role.Admin)
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

  @Get('by-title')
  async findByTitle(
    @Query('title') title: string,
  ): Promise<LocationResponseDto> {
    return this.locationService.findByTitle(title);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<LocationResponseDto> {
    return this.locationService.findOneById(id);
  }

  @Roles(Role.SuperAdmin, Role.Admin)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    return this.locationService.updateLocation(id, updateLocationDto);
  }

  @Roles(Role.SuperAdmin)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    return this.locationService.deleteLocation(id);
  }

  @Roles(Role.SuperAdmin, Role.Admin)
  @Patch('soft-delete/:id')
  async softDeleteLocation(
    @Param('id') id: number,
  ): Promise<{ message: string }> {
    return this.locationService.softDeleteLocation(id);
  }
}
