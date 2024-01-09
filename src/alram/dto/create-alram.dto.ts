import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAlramDto {
  @ApiProperty({ required: true, example: '메시지를 입력하세요.' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
