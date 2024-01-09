import { PartialType, PickType } from '@nestjs/swagger';
import { List } from '../entities/list.entity';

export class CreateListDto extends PickType(List, ['title', 'content', 'status']) {}

export class UpdateListDto extends PartialType(CreateListDto) {}
