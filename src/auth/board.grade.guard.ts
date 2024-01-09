import { BoardMembersService } from 'src/board_members/board_members.service';
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { BoardMemberRole } from "src/common/types/boardMember.type";
import { UserGrade } from "src/common/types/userGrade.type";



//
@Injectable()
export class BoarMemberRoleGuard extends AuthGuard('jwt') implements CanActivate
{
  constructor(
    private reflector: Reflector,
    private readonly boardMembersService: BoardMembersService
  )
  {
    super();
  }
  async canActivate(context: ExecutionContext)
  {
    const { user, params } = context.switchToHttp().getRequest();

    const checkBoardRole = await this.boardMembersService.findOneBoardMember(params.boardId, user.userId)
    const boardMemberRole = this.reflector.getAllAndOverride<BoardMemberRole[]>('b_roles', [
      context.getHandler(),
      context.getClass(),
    ])
    if (!boardMemberRole)
    {
      return false;
    }
    context.switchToHttp().getRequest().boardMember = checkBoardRole;

    return boardMemberRole.some((role) => checkBoardRole.role >= role);
  }

}