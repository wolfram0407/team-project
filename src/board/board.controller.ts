import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoardService } from './board.service';


@Controller('board')
export class BoardController
{
  constructor(private readonly boardService: BoardService) { }

  @Post()
  create()
  {
    return this.boardService.create();
  }

  @Get()
  findAll()
  {
    return this.boardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string)
  {
    return this.boardService.findOne(+id);
  }

}
