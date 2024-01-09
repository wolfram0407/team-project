import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { List } from '../entities/list.entity';
import { ListStatus } from '../type/list-status.type';

export class CreateListDto extends PickType(List, ['content', 'status'] as const) {
  @ApiProperty({ example: '제목 example' })
  @IsNotEmpty({ message: 'title을 작성해주세요' })
  title: string;

  @ApiProperty({ example: '내용 example' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'Backlog', enum: ListStatus })
  @IsEnum(ListStatus)
  status: ListStatus;
}

export class UpdateListDto extends PartialType(CreateListDto) {}
