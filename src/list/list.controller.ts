import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ApiTags } from '@nestjs/swagger';
import { string } from 'joi';
import { MoveListDto } from './dto/move-list.dto';

@ApiTags('LIST')
@Controller(':boardId')
export class ListController
{
  constructor(private readonly listService: ListService) { }

  /**
   * 컬럼 생성
   * @param createListDto
   * @returns
   */
  @Post('column')
  create(@Body() createListDto: CreateListDto)
  {
    return this.listService.create(createListDto);
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
  @Patch('column')
  update(@Param('id') id: number, @Body() updateListDto: UpdateListDto)
  {
    return this.listService.update(+id, updateListDto);
  }

  /**
   * 컬럼 삭제
   * @param id
   * @returns
   */
  @Delete('column')
  remove(@Param('id') id: number)
  {
    return this.listService.remove(+id);
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
  )
  {
    return this.listService.move(id, boardId, moveListDto);
  }
}
