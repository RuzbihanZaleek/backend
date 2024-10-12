import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { MESSAGES } from 'src/common/constants/messages.constants';
import { ROLE_MAPPING } from 'src/common/constants/roles.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { password, role } = registerDto;

    // validate the role
    const roleId = ROLE_MAPPING[role];
    if (!roleId) throw new BadRequestException(`Invalid role: ${role}`);

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      role_id: roleId,
    });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }
    return user;
  }

  async login(req: LoginDto) {
    const payload = { email: req.email, password: req.password };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
