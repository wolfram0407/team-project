import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class alramActivityDto {
  @ApiProperty({ required: true, example: 1 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
