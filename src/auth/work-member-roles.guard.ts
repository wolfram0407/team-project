import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { WorkspaceMemberRole } from 'src/common/types/work-member-role.type';
import { WorkspaceMembersService } from 'src/workspace-members/workspace-members.service';

@Injectable()
export class WorkspaceMemberRolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly workspaceMemberService: WorkspaceMembersService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const { user } = context.switchToHttp().getRequest();
    const workspaceId = context.switchToHttp().getRequest().params.id;

    const workspaceMember = await this.workspaceMemberService.findMyMemberInfo(
      workspaceId,
      user.userId,
    );

    const memberRole = this.reflector.getAllAndOverride<WorkspaceMemberRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!memberRole) {
      return false;
    }
    const role: boolean = memberRole.some((role) => workspaceMember.role === role);

    if (!role) {
      throw new ForbiddenException('해당 워크스페이스의 Admin만 가능합니다.');
    }
    return role;
  }
}
