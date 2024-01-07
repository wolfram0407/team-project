import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService
{
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>
  ) { }
  async create(userId: number, title: string, image_path: string)
  {
    // const board = await this.boardRepository.save({
    //   title,
    //   image_path
    // })

    return "!"
  }

  findAll()
  {
    return `This action returns all board`;
  }

  findOne(id: number)
  {
    return `This action returns a #${id} board`;
  }

}
