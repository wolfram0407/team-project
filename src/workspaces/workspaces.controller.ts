import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspaces.service';
import { ReqCreateWorkspaceDto, ReqUpdateWorkspacesDto } from './dto/req.workspace.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/common/decorator/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Workspace } from './entities/workspace.entity';

@ApiTags('Workspace')
@ApiBearerAuth()
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}
  /**
   * 워크스페이스 생성
   * @param createWorkspaceDto
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
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
  @Get(':id')
  async findOne(@Param('id') id: number, @UserInfo() user: User) {
    const workspace = await this.workspaceService.findOne(id, user.userId);
    return {
      success: 'true',
      message: '워크스페이스 조회 성공',
      data: workspace,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkspaceDto: ReqUpdateWorkspacesDto) {
    return this.workspaceService.update(+id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspaceService.remove(+id);
  }
}
