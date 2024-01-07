import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardService
{
  create()
  {
    return 'This action adds a new board';
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
