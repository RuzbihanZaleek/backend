import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MESSAGES } from 'src/common/constants/messages.constants';
import { Role } from 'src/types/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    // Check if user has a role and if it is one of the required roles
    if (!user || !user.role || !requiredRoles.includes(user.role.role_name)) {
      throw new ForbiddenException(MESSAGES.ERROR.VALIDATION.UNAUTHORIZED);
    }

    return true;
  }
}
