import { Workspace } from 'src/workspaces/entities/workspace.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service';
import {
  AddMemberDto,
  CreateBoardDto,
  DeleteMemberDto,
  UpdateBoardDto,
  UpdateMemberDto,
} from './dto/req.board';
import { ApiBearerAuth, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/common/decorator/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { BoardMembersService } from 'src/board_members/board_members.service';
import { WorkspaceService } from 'src/workspaces/workspaces.service';
import { BoardMemberRole } from 'src/common/types/boardMember.type';

import { B_Roles } from 'src/common/decorator/board.role.decorator';
import { BoarMemberRoleGuard } from 'src/auth/board.grade.guard';

@ApiTags('Board')
@Controller('b')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly boardMembersService: BoardMembersService,
    private workspaceService: WorkspaceService,
  ) {}

  // 보드 생성
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() { title, image_path, workSpaceId }: CreateBoardDto,
    @UserInfo() { userId }: User,
  ) {
    return this.boardService.create(workSpaceId, userId, title, image_path);
  }
  // 로그인된 유저  기준 전체보드 조회
  // 등급별로 조회도 필요할듯
  @ApiBearerAuth()
  @Get()
  findAll(@UserInfo() { userId }: User) {
    return this.boardService.findAll(userId);
  }

  // 로그인된 유저 및 선택된 보드를 조회
  @ApiBearerAuth()
  @Get(':boardId/:boardTitle')
  findOne(
    @Param('boardId') boardId: string,
    @Param('boardTitle') bt: string,
    @UserInfo() { userId }: User,
  ) {
    console.log(boardId, bt);

    return this.boardService.findOne(bt, userId);
  }
  // 검색
  @ApiBearerAuth()
  @Get('/find/:search')
  searchBoard(@Param('search') search: string) {
    return this.boardService.searchBoard(search);
  }

  // 보드 전체 수정
  @UseGuards(BoarMemberRoleGuard)
  @B_Roles(BoardMemberRole.Admin)
  @ApiBearerAuth()
  @Put('/:id')
  updateBoard(@Param('id') id: string, @Body() { title, image_path }: UpdateBoardDto) {
    return this.boardService.updateBoard(+id, title, image_path);
  }

  // 보드 삭제  // 일반 유저는 보드 떠나기
  @UseGuards(BoarMemberRoleGuard)
  @B_Roles(BoardMemberRole.Admin)
  @ApiBearerAuth()
  @Delete('/:boardId')
  deleteBoard(@UserInfo() { userId }: User, @Param('boardId') id: string) {
    return this.boardService.deleteBoard(+id, userId);
  }

  // 보드 멤버

  /**
   * 보드 멤버 추가
   */

  @UseGuards(BoarMemberRoleGuard)
  @B_Roles(BoardMemberRole.Member)
  @ApiBearerAuth()
  @ApiQuery({ name: 'role', enum: BoardMemberRole })
  @Post('/addMember/:boardId')
  addNewMember(
    @Param('boardId') boardId: string,
    @Query('role') role: BoardMemberRole = BoardMemberRole.Member,
    @Body() { email }: AddMemberDto,
  ) {
    return this.boardService.AddMember(+boardId, email, role);
  }

  /**
   * 보드 멤버 조회
   */
  @UseGuards(BoarMemberRoleGuard)
  @B_Roles(BoardMemberRole.Observer)
  @ApiBearerAuth()
  @Get('/getMember/:boardId')
  getBoardMembers(@Param('boardId') boardId: string) {
    return this.boardMembersService.findBoardMembers(+boardId);
  }
  /**
   * 보드 역할 수정
   */

  @UseGuards(BoarMemberRoleGuard)
  @B_Roles(BoardMemberRole.Admin)
  @ApiBearerAuth()
  @ApiQuery({
    name: 'role',
    enum: BoardMemberRole,
    description: '[Observer ,Member ,Admin]',
  })
  @ApiBearerAuth()
  @Put('/putMembers/:boardId')
  updateMember(
    @Body() { userId }: UpdateMemberDto,
    @Query('role') role: BoardMemberRole,
    @Param('boardId') boardId: string,
  ) {
    return this.boardMembersService.updateMember(+boardId, userId, role);
  }

  /**
   * 보드 멤버 삭제
   */
  @UseGuards(BoarMemberRoleGuard)
  @B_Roles(BoardMemberRole.Admin)
  @ApiBearerAuth()
  @Delete('/deleteMembers/:boardId')
  deleteMember(@Param('boardId') boardId: string, @Body() { userId }: DeleteMemberDto) {
    return this.boardMembersService.deleteMember(+boardId, userId);
  }

  /**
   * 보드 탈퇴
   */
  @UseGuards(BoarMemberRoleGuard)
  @B_Roles(BoardMemberRole.Member)
  @ApiBearerAuth()
  @Delete('/outMembers/:boardId')
  outBoardMember(@Param('boardId') boardId: string, @UserInfo() { userId }: User) {
    return this.boardMembersService.deleteMember(+boardId, userId);
  }

  // 로그인된 유저 및 선택된 보드를 조회
  @ApiBearerAuth()
  @Get(':boardId/:boardTitle')
  findOne(
    @Param('boardId') boardId: string,
    @Param('boardTitle') bt: string,
    @UserInfo() { userId }: User,
  ) {
    return this.boardService.findOne(bt, userId);
  }

  // 보드 사용여부
}
