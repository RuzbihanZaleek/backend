import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async register(@Body() userDto: RegisterDto, @Request() req) {
    const currentUser = req.user;
    return this.authService.register(userDto, currentUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() req: LoginDto) {
    return this.authService.login(req);
  }
}
