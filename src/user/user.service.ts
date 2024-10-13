import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(userData: Partial<User>): Promise<Omit<User, 'password'>> {
    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);
    
    // Exclude the password field before returning the user
    const { password, ...result } = savedUser;
    return result;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email }, relations: ['role'] });
  }
}