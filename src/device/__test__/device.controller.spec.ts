import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeviceType, Status } from 'src/types/enums';
import { DeviceController } from '../device.controller';
import { DeviceService } from '../device.service';
import { CreateDeviceDto } from '../dto/create-device.dto';
import { Device } from '../device.entity';
import { UpdateDeviceDto } from '../dto/update-device.dto';

describe('DeviceController', () => {
  let deviceController: DeviceController;
  let deviceService: DeviceService;

  const mockDeviceService = {
    createDevice: jest.fn(),
    findAll: jest.fn(),
    findByType: jest.fn(),
    findOneById: jest.fn(),
    updateDevice: jest.fn(),
    deleteDevice: jest.fn(),
    softDeleteDevice: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceController],
      providers: [
        {
          provide: DeviceService,
          useValue: mockDeviceService,
        },
      ],
    }).compile();

    deviceController = module.get<DeviceController>(DeviceController);
    deviceService = module.get<DeviceService>(DeviceService);
  });

  it('should be defined', () => {
    expect(deviceController).toBeDefined();
  });

  describe('createDevice', () => {
    it('should create a new device', async () => {
      const createDeviceDto: CreateDeviceDto = {
        serial_number: 'SN123456',
        type: DeviceType.Pos,
        image: 'image.png',
        status: Status.Active,
        locationId: 1,
      };
      const device = new Device();
      jest.spyOn(deviceService, 'createDevice').mockResolvedValue(device);

      expect(await deviceController.createDevice(createDeviceDto)).toBe(device);
    });
  });

  describe('findAll', () => {
    it('should return an array of devices', async () => {
      const result: Device[] = [new Device(), new Device()];
      jest.spyOn(deviceService, 'findAll').mockResolvedValue(result);

      expect(await deviceController.findAll()).toBe(result);
    });
  });

  describe('findByType', () => {
    it('should return devices by type', async () => {
      const result: Device[] = [new Device(), new Device()];
      jest.spyOn(deviceService, 'findByType').mockResolvedValue(result);
      const type = DeviceType.Pos;

      expect(await deviceController.findByType(type)).toBe(result);
    });
  });

  describe('findOneById', () => {
    it('should return a device by id', async () => {
      const deviceId = 1;
      const device = new Device();
      jest.spyOn(deviceService, 'findOneById').mockResolvedValue(device);

      expect(await deviceController.findOneById(deviceId)).toBe(device);
    });

    it('should throw NotFoundException if device not found', async () => {
      const deviceId = 999;
      jest
        .spyOn(deviceService, 'findOneById')
        .mockRejectedValue(new NotFoundException());

      await expect(deviceController.findOneById(deviceId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateDevice', () => {
    it('should update a device', async () => {
      const deviceId = 1;
      const updateDeviceDto: UpdateDeviceDto = { serial_number: 'SN123456' };
      const device = new Device();
      jest.spyOn(deviceService, 'updateDevice').mockResolvedValue(device);

      expect(
        await deviceController.updateDevice(deviceId, updateDeviceDto),
      ).toBe(device);
    });
  });

  describe('deleteDevice', () => {
    it('should delete a device', async () => {
      const deviceId = 1;
      const result = { message: 'Device deleted successfully' };
      jest.spyOn(deviceService, 'deleteDevice').mockResolvedValue(result);

      expect(await deviceController.deleteDevice(deviceId)).toBe(result);
    });
  });

  describe('softDeleteDevice', () => {
    it('should soft delete a device', async () => {
      const deviceId = 1;
      const result = { message: 'Device deleted successfully' };
      jest.spyOn(deviceService, 'softDeleteDevice').mockResolvedValue(result);

      expect(await deviceController.softDeleteDevice(deviceId)).toBe(result);
    });
  });
});
