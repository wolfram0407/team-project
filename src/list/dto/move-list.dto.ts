import { PickType } from '@nestjs/swagger';
import { List } from '../entities/list.entity';

export class MoveListDto extends PickType(List, ['position']) {}
