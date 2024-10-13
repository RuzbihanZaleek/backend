import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './location.entity';
import { LocationResponseDto } from 'src/user/dto/location-response.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/types/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
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
}
