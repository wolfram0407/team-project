import { Controller, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ListService } from './list.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MoveListDto } from './dto/move-list.dto';
import { CreateListDto, UpdateListDto } from './dto/req-list.dto';

@ApiTags('LIST')
@ApiBearerAuth()
@Controller(':boardId')
export class ListController {
  constructor(private readonly listService: ListService) {}

  /**
   * 컬럼 생성
   * @param createListDto
   * @returns
   */
  @Post('column')
  async create(@Param('boardId') boardId: string, @Body() createListDto: CreateListDto) {
    // boardId를 숫자로 변환합니다.
    const numericBoardId = Number(boardId);

    // 변환된 boardId와 createListDto를 create 메서드에 전달합니다.
    const data = await this.listService.create(numericBoardId, createListDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: '컬럼 생성 완료',
      data,
    };
  }

  /**
   * 컬럼 수정
   * @param id
   * @param updateListDto
   * @returns
   */
  @Patch('column/:id')
  update(@Param('id') id: number, @Body() updateListDto: UpdateListDto) {
    return this.listService.update(id, updateListDto);
  }

  /**
   * 컬럼 삭제
   * @param id
   * @returns
   */
  @Delete('column/:id')
  remove(@Param('id') id: number) {
    return this.listService.remove(id);
  }

  /**
   * 컬럼 이동
   * @param id
   * @param boardId
   * @param moveListDto
   * @returns
   */
  @Patch('column/:id/move')
  move(
    @Param('id') id: number,
    @Param('boardId') boardId: number,
    @Body() moveListDto: MoveListDto,
  ) {
    return this.listService.move(id, boardId, moveListDto);
  }
}
