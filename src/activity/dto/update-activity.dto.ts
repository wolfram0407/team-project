import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateActivityDto } from './create-activity.dto';

export class UpdateActivityDto extends PickType(CreateActivityDto, ['content']) {
  @ApiProperty({ required: true, example: '댓글을 입력하세요.' })
  content: string;
}
