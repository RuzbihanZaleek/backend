import { beforeEach, describe, it } from 'node:test';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { User } from 'src/user/user.entity';
import { Role } from 'src/role/role.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;

  const registerDTO = {
    first_name: 'John',
    last_name: 'Doe15',
    email: 'jd30@gmail.com',
    password: 'jd15@123',
    role: 'User',
  };

  const registeredDTO = {
    id: 1,
    email: 'jd25@gmail.com',
    role: { role_name: 'User' },
  };

  const mockUser = {
    id: 1,
    email: 'jd25@gmail.com',
    password: 'hashedPassword',
    role: { role_name: 'User' },
  } as User;

  const mockRole = {
    id: 1,
    role_name: 'User',
  } as Role;

  const mockUserRepository = {
    find: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn((options) => {
      if (options.where.email === 'jd50@gmail.com') {
        return Promise.resolve(mockUser);
      }
      return Promise.resolve(null);
    }),
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
  } as unknown as Repository<User>;

  const mockRoleRepository = {
    find: jest.fn().mockResolvedValue([mockRole]),
    findOne: jest.fn().mockResolvedValue(mockRole),
    create: jest.fn().mockReturnValue(mockRole),
    save: jest.fn().mockResolvedValue(mockRole),
  } as unknown as Repository<Role>;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockedJwtToken'),
    verify: jest.fn(),
  } as unknown as JwtService;

  const mockRequest = {} as Request;

  beforeEach(() => {
    userService = new UserService(mockUserRepository, mockRoleRepository);
    authService = new AuthService(userService, mockJwtService);
    authController = new AuthController(authService);
  });

  it('should register a user', async () => {
    const result = await authController.register(registerDTO, registerDTO);
    expect(result).toEqual(registeredDTO);
  });
});
