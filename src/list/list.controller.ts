import { Controller, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ListService } from './list.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MoveListDto } from './dto/move-list.dto';
import { CreateListDto, UpdateListDto } from './dto/req-list.dto';

@ApiTags('List')
@ApiBearerAuth()
@Controller('list/:boardId')
export class ListController {
  constructor(private readonly listService: ListService) {}

  /**
   * 리스트 생성
   * @param createListDto
   * @returns
   */
  @Post('column')
  async create(@Param('boardId') boardId: string, @Body() createListDto: CreateListDto) {
    // boardId를 숫자로 변환.
    const numericBoardId = Number(boardId);

    // 변환된 boardId와 createListDto를 create 메서드에 전달.
    const data = await this.listService.create(numericBoardId, createListDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: '컬럼 생성 완료',
      data,
    };
  }

  /**
   * 리스트 title 수정
   * @param id
   * @param updateListDto
   * @returns
   */
  @Patch('column/:id')
  update(@Param('id') id: number, @Body() updateListDto: UpdateListDto) {
    return this.listService.update(id, updateListDto);
  }

  /**
   * 리스트 삭제
   * @param id
   * @returns
   */
  @Delete('column/:id')
  remove(@Param('id') id: number) {
    return this.listService.remove(id);
  }

  /**
   * 리스트 이동
   * @param listId
   * @param board_id
   * @param moveListDto
   * @returns
   */
  @Patch('column/:listId/:boardId/move')
  async moveList(
    @Param('listId') id: number,
    @Param('boardId') board_id: number,
    @Body() moveListDto: MoveListDto,
  ) {
    const data = await this.listService.moveList(id, board_id, moveListDto);
    // console.log('$#$$#$#$#$$##$$##', id, boardId, moveListDto);

    return {
      statusCode: HttpStatus.OK,
      message: '리스트 위치 변경',
    };
  }
}
