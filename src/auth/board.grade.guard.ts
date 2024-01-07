import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { UserGrade } from "src/common/types/userGrade.type";




@Injectable()
export class BoardGuard extends AuthGuard('jwt') implements CanActivate
{
  constructor(private reflector: Reflector)
  {
    super();
  }
  canActivate(context: ExecutionContext)
  {


    const authenticated = super.canActivate(context);

    return authenticated;
  }

}