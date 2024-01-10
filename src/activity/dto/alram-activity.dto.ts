import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class alramActivityDto {
  @ApiProperty({ required: true, example: 1 })
  @IsString()
  @IsNotEmpty()
  userId: number;
}
