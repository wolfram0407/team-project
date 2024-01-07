import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkspaceMembersService } from './workspace-members.service';
import { ReqCreateWorkspaceMemberDto } from './dto/req.work-member.dto';
import { ReqUpdateWorkspaceMemberDto } from './dto/req.work-member.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/common/decorator/user.decorator';
import { User } from 'src/user/entities/user.entity';

@ApiTags('WorkspaceMember')
@ApiBearerAuth()
@Controller('workspace-members')
export class WorkspaceMembersController {
  constructor(private readonly workspaceMembersService: WorkspaceMembersService) {}

  @Post()
  create(@Body() createWorkspaceMemberDto: ReqCreateWorkspaceMemberDto) {
    return this.workspaceMembersService.create(createWorkspaceMemberDto);
  }

  @Get()
  findAll() {
    return this.workspaceMembersService.findAll();
  }

  /**
   * 특정 워크스페이스의 멤버 조회(나의 멤버 상태)
   * @param workspaceId
   * @param user
   * @returns
   */
  @Get(':workspaceId')
  findMyMemberInfo(@Param('workspaceId') workspaceId: number, @UserInfo() user: User) {
    return this.workspaceMembersService.findMyMemberInfo(workspaceId, user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkspaceMemberDto: ReqUpdateWorkspaceMemberDto) {
    return this.workspaceMembersService.update(+id, updateWorkspaceMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspaceMembersService.remove(+id);
  }
}
