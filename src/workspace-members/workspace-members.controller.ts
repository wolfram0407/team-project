import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
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

  /**
   * 워크스페이스 내 특정 멤버들 조회(name)
   * @param workspaceId
   * @param name
   * @returns
   */
  @UseGuards(WorkspaceMemberRolesGuard)
  @Roles(...Object.values(WorkspaceMemberRole))
  @Get(':workspaceId/name')
  async findMembersByName(@Param('workspaceId') workspaceId: number, @Query('name') name: string) {
    const members = await this.workspaceMembersService.findMembersByName(workspaceId, name);
    return {
      success: 'true',
      message: '워크스페이스 멤버 조회 완료',
      data: members,
    };
  }

  /**
   * 특정 워크스페이스 전체 멤버 조회
   * @param workspaceId
   * @returns
   */
  @UseGuards(WorkspaceMemberRolesGuard)
  @Roles(...Object.values(WorkspaceMemberRole))
  @Get(':workspaceId')
  async findAll(@Param('workspaceId') workspaceId: number) {
    const members = await this.workspaceMembersService.findAll(workspaceId);
    return {
      success: 'true',
      message: '워크스페이스 멤버 조회 완료',
      data: members,
    };
  }

  /**
   * 워크스페이스 멤버 역할 수정
   * @param workspaceId
   * @param role
   * @param userId
   * @returns
   */
  @UseGuards(WorkspaceMemberRolesGuard)
  @Roles(WorkspaceMemberRole.Admin)
  @Patch(':workspaceId/user')
  async update(
    @Param('workspaceId') workspaceId: number,
    @Body() ReqUpdateWorkspaceMemberDto: ReqUpdateWorkspaceMemberDto,
    @Query('user') userId: number,
  ) {
    await this.workspaceMembersService.update(workspaceId, ReqUpdateWorkspaceMemberDto, userId);
    return {
      success: 'true',
      message: '워크스페이스 멤버 수정 완료',
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspaceMembersService.remove(+id);
  }
}
