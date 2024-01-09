import { Controller, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ListService } from './list.service';
import { ApiTags } from '@nestjs/swagger';
import { MoveListDto } from './dto/move-list.dto';
import { CreateListDto, UpdateListDto } from './dto/req-list.dto';

@ApiTags('LIST')
@Controller(':boardId')
export class ListController {
  constructor(private readonly listService: ListService) {}

  /**
   * 컬럼 생성
   * @param createListDto
   * @returns
   */
  @Post('column')
  async create(@Body() createListDto: CreateListDto) {
    const data = await this.listService.create(createListDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: '컬럼 생성 완료',
      data,
    };
  }

  // @Get()
  // findAll() {
  //   return this.listService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.listService.findOne(+id);
  // }

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
