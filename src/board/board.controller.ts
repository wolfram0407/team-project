import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/req.board';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/common/decorator/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { WorkspaceGuard } from 'src/auth/workspace.guard';
import { WorkspaceInfo } from 'src/common/decorator/workspace.decorator';
import { Workspace } from 'src/workspaces/entities/workspace.entity';

@ApiTags('Board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() { title, image_path }: CreateBoardDto, @UserInfo() { userId }: User) {
    // 보드 생기는거 확인하고 멤버 추가 하자
    // 유저 멤버 테이블 생성 필요(무조건 생기도록 하자)
    // 생성한 유저가 디폴트로 가입
    return this.boardService.create(userId, title, image_path);
  }

  @ApiBearerAuth()
  @Get()
  findAll(@UserInfo() { userId }: User) {
    return this.boardService.findAll(userId);
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string, @UserInfo() { userId }: User) {
    return this.boardService.findOne(+id, userId);
  }
}
