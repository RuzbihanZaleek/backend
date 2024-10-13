import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Device } from "./device.entity";
import { DeviceService } from "./device.service";
import { DeviceController } from "./device.controller";
import { Location } from "src/location/location.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Device, Location])],
    providers: [DeviceService],
    controllers: [DeviceController],
  })
  export class DeviceModule {}