import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../user/dto/user-register.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { MESSAGES } from 'src/common/constants/messages.constants';
import { ROLE_MAPPING, Role } from 'src/types/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
    currentUser: User,
  ): Promise<Omit<User, 'password'>> {
    const { email, password, role } = registerDto;

    // Validate the role for admin creation
    if (role === Role.Admin || role === Role.SuperAdmin) {
      const currentUserRole = currentUser.role.role_name;
      if (currentUserRole !== Role.SuperAdmin) {
        throw new BadRequestException(MESSAGES.ERROR.VALIDATION.CANNOT_CREATE_ADMIN_ROLES);
      }
    }

    // Check for uniqueness in the database
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException(MESSAGES.ERROR.VALIDATION.EMAIL_IN_USE(email));
    }

    // validate the role
    const roleId = ROLE_MAPPING[role];
    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      role: roleId,
    });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(MESSAGES.ERROR.VALIDATION.INVALID_CREDENTIALS);
    }
    return user;
  }

  async login(req: LoginDto) {
    const user = await this.usersService.findByEmail(req.email);
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role.role_name,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
