import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './location.entity';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { UserLocation } from 'src/user/user-location.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, UserLocation, User])],
  providers: [LocationService],
  controllers: [LocationController],
})
export class LocationModule {}
