import { Workspace } from 'src/workspaces/entities/workspace.entity';
import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { BoardService } from './board.service';
import { AddMemberDto, CreateBoardDto, UpdateBoardDto } from './dto/req.board';
import { ApiBearerAuth, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/common/decorator/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { BoardMembersService } from 'src/board_members/board_members.service';
import { WorkspaceService } from 'src/workspaces/workspaces.service';
import { BoardMemberRole } from 'src/common/types/boardMember.type';

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
  @ApiBearerAuth()
  @Put('/:id')
  updateBoard(@Param('id') id: string, @Body() { title, image_path }: UpdateBoardDto) {
    return this.boardService.updateBoard(+id, title, image_path);
  }

  // 보드 삭제  // 일반 유저는 보드 떠나기
  @ApiBearerAuth()
  @Delete('/:id')
  deleteBoard(@UserInfo() { userId }: User, @Param('id') id: string) {
    return this.boardService.deleteBoard(+id, userId);
  }

  // 보드 멤버 조회
  @ApiBearerAuth()
  @Get('/getMembers/:boardId')
  getBoardMembers(@Param('boardId') boardId: string) {
    return this.boardMembersService.findBoardMembers(+boardId);
  }
  // 여기 해야됨 _ 보드 생성시 워크스페이스 아이디 값 존재
  // 워크 스페이스를 가드에서 id  값 찾아서 진행
  //보드 멤버 추가
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

  // 보드 사용여부
}
