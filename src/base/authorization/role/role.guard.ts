import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';
import { RoleGroup } from './role.enum';
import { BadRequestException } from 'src/base/exceptions/custom.exception';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) {
      return true;
    }
    // return false
    const { user } = context.switchToHttp().getRequest();
    console.log(user)

    if (user.role === RoleGroup.SuperAdmin) {
      return true;
    }
    if (!RoleGuard.matchRoles(roles, user?.role)) {
      throw new BadRequestException();
    }

    return true;
  }

  private static matchRoles(roles: Array<any>, userRole: string) {
    return roles.some((role) => role === userRole);
  }
}
