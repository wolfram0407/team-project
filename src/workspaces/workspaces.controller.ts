import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspaces.service';
import { ReqCreateWorkspaceDto, ReqUpdateWorkspacesDto } from './dto/req.workspace.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/common/decorator/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceMemberRolesGuard } from 'src/auth/work-member-roles.guard';
import { WorkspaceMemberRole } from 'src/common/types/work-member-role.type';
import { Roles } from 'src/common/decorator/role.decorator';

@ApiTags('Workspace')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}
  /**
   * 워크스페이스 생성
   * @param createWorkspaceDto
   * @returns
   */
  @Post()
  async create(@Body() createWorkspaceDto: ReqCreateWorkspaceDto, @UserInfo() user: User) {
    await this.workspaceService.create(createWorkspaceDto, user);
    return {
      success: 'true',
      message: '워크스페이스 생성 완료',
    };
  }

  /**
   * 워크스페이스 조회(내가 소속된 모든 워크스페이스)
   * @returns
   */
  @Get()
  async findAll(
    @UserInfo()
    user: User,
  ) {
    const workspaces: Workspace[] = await this.workspaceService.findAll(user.userId);
    return {
      success: 'true',
      message: '워크스페이스 조회 성공',
      data: workspaces,
    };
  }
  /**
   * 특정 워크스페이스 조회
   * @param id
   * @param user
   * @returns
   */
  @UseGuards(WorkspaceMemberRolesGuard)
  @Roles(...Object.values(WorkspaceMemberRole))
  @Get(':id')
  async findOne(@Param('id') id: number, @UserInfo() user: User) {
    const workspace = await this.workspaceService.findOne(id, user.userId);
    return {
      success: 'true',
      message: '워크스페이스 조회 성공',
      data: workspace,
    };
  }

  /**
   * 특정 워크스페이스 수정
   * @param id
   * @param updateWorkspaceDto
   * @returns
   */
  @UseGuards(WorkspaceMemberRolesGuard)
  @Roles(WorkspaceMemberRole.Admin)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateWorkspaceDto: ReqUpdateWorkspacesDto,
    @UserInfo() user: User,
  ) {
    await this.workspaceService.update(id, updateWorkspaceDto, user.userId);
    return {
      success: 'true',
      message: '워크스페이스 수정 성공',
    };
  }

  /**
   * 특정 워크스페이스 삭제
   * @param id
   * @returns
   */
  @UseGuards(WorkspaceMemberRolesGuard)
  @Roles(WorkspaceMemberRole.Admin)
  @Delete(':id')
  async remove(@Param('id') id: number, @UserInfo() user: User) {
    await this.workspaceService.remove(id, user.userId);
    return {
      success: 'true',
      message: '워크스페이스 삭제 성공',
    };
  }
}
