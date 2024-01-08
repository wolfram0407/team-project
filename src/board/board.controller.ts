import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto, UpdateBoardDto } from './dto/req.board';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/common/decorator/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { BoardMembersService } from 'src/board_members/board_members.service';

@ApiTags('Board')
@Controller('board')
export class BoardController
{
  constructor(
    private readonly boardService: BoardService,
    private readonly boardMembersService: BoardMembersService,
  ) { }

  // 보드 생성
  @ApiBearerAuth()
  @Post()
  create(
    @Body() { title, image_path }: CreateBoardDto,
    @UserInfo() { userId }: User,
  )
  {
    // 보드 생기는거 확인하고 멤버 추가 하자 
    // 유저 멤버 테이블 생성 필요(무조건 생기도록 하자)
    // 생성한 유저가 디폴트로 가입
    return this.boardService.create(userId, title, image_path);
  }
  // 로그인된 유저  기준 전체보드 조회
  // 등급별로 조회도 필요할듯
  @ApiBearerAuth()
  @Get()
  findAll(@UserInfo() { userId }: User,)
  {
    return this.boardService.findAll(userId);
  }

  // 로그인된 유저 및 선택된 보드를 조회
  @ApiBearerAuth()
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @UserInfo() { userId }: User,
  )
  {
    return this.boardService.findOne(+id, userId);
  }
  // 검색
  @ApiBearerAuth()
  @Get('/find/:search')
  searchBoard(
    @Param('search') search: string,
  )
  {
    return this.boardService.searchBoard(search);
  }
  // 보드 전체 수정
  @ApiBearerAuth()
  @Put('/:id')
  updateBoard(
    @Param('id') id: string,
    @Body() { title, image_path }: UpdateBoardDto
  )
  {
    return this.boardService.updateBoard(+id, title, image_path);
  }

  // 보드 삭제  // 일반 유저는 보드 떠나기
  @ApiBearerAuth()
  @Delete('/:id')
  deleteBoard(
    @UserInfo() { userId }: User,
    @Param('id') id: string)
  {
    return this.boardService.deleteBoard(+id, userId);
  }


  // 보드 멤버 조회
  @ApiBearerAuth()
  @Get('/getMembers/:boardId')
  getBoardMembers(
    @Param('boardId') boardId: string
  )
  {
    return this.boardMembersService.findBoardMembers(+boardId)

  }

  //보드 멤버 추가



  // 보드 사용여부
}
