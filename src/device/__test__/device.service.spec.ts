import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Location } from 'src/location/location.entity';
import { DeviceType, Status } from 'src/types/enums';
import { DeviceService } from '../device.service';
import { Device } from '../device.entity';
import { CreateDeviceDto } from '../dto/create-device.dto';
import { UpdateDeviceDto } from '../dto/update-device.dto';

describe('DeviceService', () => {
  let deviceService: DeviceService;
  let deviceRepository: Repository<Device>;
  let locationRepository: Repository<Location>;

  const mockDeviceRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    merge: jest.fn(),
  };

  const mockLocationRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        {
          provide: getRepositoryToken(Device),
          useValue: mockDeviceRepository,
        },
        {
          provide: getRepositoryToken(Location),
          useValue: mockLocationRepository,
        },
      ],
    }).compile();

    deviceService = module.get<DeviceService>(DeviceService);
    deviceRepository = module.get<Repository<Device>>(
      getRepositoryToken(Device),
    );
    locationRepository = module.get<Repository<Location>>(
      getRepositoryToken(Location),
    );
  });

  it('should be defined', () => {
    expect(deviceService).toBeDefined();
  });

  describe('createDevice', () => {
    it('should create a device', async () => {
      const createDeviceDto: CreateDeviceDto = {
        serial_number: 'SN123456',
        type: DeviceType.Kiosk,
        image: 'image.png',
        status: Status.Inactive,
        locationId: 1,
      };
      const location = new Location();
      location.devices = [];
      location.id = 1;

      mockLocationRepository.findOne.mockResolvedValue(location);
      mockDeviceRepository.findOne.mockResolvedValue(null);
      const savedDevice = new Device();
      mockDeviceRepository.create.mockReturnValue(savedDevice);
      mockDeviceRepository.save.mockResolvedValue(savedDevice);

      const result = await deviceService.createDevice(createDeviceDto);
      expect(result).toBe(savedDevice);
    });

    it('should throw BadRequestException if more than 10 devices', async () => {
      const createDeviceDto: CreateDeviceDto = {
        serial_number: 'SN123456',
        type: DeviceType.Kiosk,
        image: 'image.png',
        status: Status.Active,
        locationId: 1,
      };
      const location = new Location();
      location.devices = new Array(10).fill(new Device());

      mockLocationRepository.findOne.mockResolvedValue(location);
      await expect(deviceService.createDevice(createDeviceDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException for duplicate serial number', async () => {
      const createDeviceDto: CreateDeviceDto = {
        serial_number: 'SN123456',
        type: DeviceType.Signage,
        image: 'image.png',
        status: Status.Inactive,
        locationId: 1,
      };
      const location = new Location();
      location.devices = [];

      mockLocationRepository.findOne.mockResolvedValue(location);
      mockDeviceRepository.findOne.mockResolvedValue(new Device());

      await expect(deviceService.createDevice(createDeviceDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all devices', async () => {
      const result = [new Device(), new Device()];
      mockDeviceRepository.find.mockResolvedValue(result);

      expect(await deviceService.findAll()).toBe(result);
      expect(mockDeviceRepository.find).toHaveBeenCalledWith({
        relations: ['location'],
      });
    });
  });

  describe('findOneById', () => {
    it('should return a device by ID', async () => {
      const device = new Device();
      mockDeviceRepository.findOne.mockResolvedValue(device);

      expect(await deviceService.findOneById(1)).toBe(device);
    });

    it('should throw NotFoundException if device not found', async () => {
      mockDeviceRepository.findOne.mockResolvedValue(null);
      await expect(deviceService.findOneById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateDevice', () => {
    it('should update a device', async () => {
      const deviceId = 1;
      const updateDeviceDto: UpdateDeviceDto = { serial_number: 'SN654321' };
      const existingDevice = new Device();
      existingDevice.id = deviceId;
      mockDeviceRepository.findOne.mockResolvedValue(existingDevice);
      const updatedDevice = new Device();
      mockDeviceRepository.merge.mockReturnValue(updatedDevice);
      mockDeviceRepository.save.mockResolvedValue(updatedDevice);

      const result = await deviceService.updateDevice(
        deviceId,
        updateDeviceDto,
      );
      expect(result).toBe(updatedDevice);
    });

    it('should throw NotFoundException if device not found', async () => {
      const deviceId = 999;
      const updateDeviceDto: UpdateDeviceDto = { serial_number: 'SN654321' };
      mockDeviceRepository.findOne.mockResolvedValue(null);

      await expect(
        deviceService.updateDevice(deviceId, updateDeviceDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
