import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Workspace } from 'src/workspaces/entities/workspace.entity';
import { WorkspaceService } from 'src/workspaces/workspaces.service';

@Injectable()
export class WorkspaceGuard extends AuthGuard('jwt') implements CanActivate
{
  constructor(private readonly workspaceService: WorkspaceService)
  {
    super();
  }
  async canActivate(context: ExecutionContext)
  {
    const { user } = context.switchToHttp().getRequest();
    const workspaceId = context.switchToHttp().getRequest().params.workspaceId; // param 에서 workspaceId를 주시면 !
    // 보드아이디를 가지고와서 조회 
    // 해당 워크스페이스 아이디를 통해 찾으면 됩니다!!!

    try
    {
      const workspace: Workspace = await this.workspaceService.findOneByWorkspaceIdAndUserId(
        // 이 함수에서 검증 워크스페이스 존재 여부 확인 후
        workspaceId,
        user.userId,
      );

      context.switchToHttp().getRequest().workspace = workspace; // req.workspace에 담음
      return true;
    } catch (err)
    {
      console.error(err);
      return false;
    }
  }
}
