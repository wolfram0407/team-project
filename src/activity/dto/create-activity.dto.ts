import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({ required: true, example: '댓글을 입력하세요.' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
