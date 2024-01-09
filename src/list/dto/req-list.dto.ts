import { PartialType, PickType } from '@nestjs/swagger';
import { List } from '../entities/list.entity';
// import { IsNumber } from 'class-validator';

export class CreateListDto extends PickType(List, ['title', 'content', 'status']) {
  //   @IsNumber()
  //   boardId: number;
}

export class UpdateListDto extends PartialType(CreateListDto) {}
