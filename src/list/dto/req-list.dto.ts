import { PartialType, PickType } from '@nestjs/swagger';
import { List } from '../entities/list.entity';
import { IsNotEmpty } from 'class-validator';
// import { IsNumber } from 'class-validator';

export class CreateListDto extends PickType(List, ['content', 'status']) {
  @IsNotEmpty({ message: 'title 을 작성해주세요' })
  title: string;
  //   @IsNumber()
  //   boardId: number;
}

export class UpdateListDto extends PartialType(CreateListDto) {}
