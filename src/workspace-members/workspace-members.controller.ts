import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WorkspaceMembersService } from './workspace-members.service';
import { ReqCreateWorkspaceMemberDto } from './dto/req.work-member.dto';
import { ReqUpdateWorkspaceMemberDto } from './dto/req.work-member.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/common/decorator/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { WorkspaceMemberRolesGuard } from 'src/auth/work-member-roles.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { WorkspaceMemberRole } from 'src/common/types/work-member-role.type';

@ApiTags('WorkspaceMember')
@ApiBearerAuth()
@Controller('workspace-members')
export class WorkspaceMembersController {
  constructor(private readonly workspaceMembersService: WorkspaceMembersService) {}

  /**
   * 워크스페이스 멤버 초대
   * @param createWorkspaceMemberDto
   * @param workspaceId
   * @returns
   */
  @UseGuards(WorkspaceMemberRolesGuard)
  @Roles(WorkspaceMemberRole.Admin, WorkspaceMemberRole.Member)
  @Post(':workspaceId')
  async create(
    @Body() createWorkspaceMemberDto: ReqCreateWorkspaceMemberDto,
    @Param('workspaceId') workspaceId: number,
  ) {
    await this.workspaceMembersService.create(createWorkspaceMemberDto, workspaceId);
    return {
      success: 'true',
      message: '워크스페이스 멤버 초대 완료',
    };
  }

  @Get()
  findAll() {
    return this.workspaceMembersService.findAll();
  }

  /**
   * 특정 워크스페이스의 멤버 조회
   * @param workspaceId
   * @param user
   * @returns
   */
  @Get(':workspaceId')
  findMyMemberInfo(@Param('workspaceId') workspaceId: number, @UserInfo() user: User) {
    return this.workspaceMembersService.findMemberByWorkspaceIdAndUserId(workspaceId, user.userId);
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
