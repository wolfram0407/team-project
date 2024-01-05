import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { UserGrade } from "src/common/types/userGrade.type";




@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate
{
  constructor(private reflector: Reflector)
  {
    super();
  }
  async canActivate(context: ExecutionContext)
  {
    const { user } = context.switchToHttp().getRequest();
    const userRole = this.reflector.getAllAndOverride<UserGrade[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])
    if (!userRole)
    {
      return false;
    }
    const role = userRole.some((role) => user.role >= role)
    return role
  }

}