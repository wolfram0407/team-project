import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const WorkspaceInfo = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.workspace ? request.workspace : null;
});
