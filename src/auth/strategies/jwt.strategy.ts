import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
      ignoreExpiration: false, // Do not ignore expiration
      secretOrKey: process.env.JWT_SECRET || 'yourSecretKey', // Use your secret key
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.usersService.findById(payload.sub); // Find user by id in the token payload
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; // Return user if found
  }
}
