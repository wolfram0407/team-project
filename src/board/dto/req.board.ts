import { ApiProperty, ApiQuery, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  isNumber,
} from 'class-validator';
import { BoardMemberRole } from 'src/common/types/boardMember.type';

export class CreateBoardDto {
  @ApiProperty({ required: true, example: 'test보드' })
  @IsString()
  @MaxLength(30)
  title: string;

  @ApiProperty({ example: 'cp872722/2022/12/202212008462_500.jpg' })
  @IsOptional()
  @IsString()
  image_path: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  workSpaceId: number;
}

export class UpdateBoardDto extends PartialType(CreateBoardDto) {}

export class AddMemberDto {
  @ApiProperty({ required: true, example: 'test3@test.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UpdateMemberDto {
  @ApiProperty({ required: true, example: 3 })
  @IsNumber()
  userId: number;
}

export class DeleteMemberDto extends PartialType(UpdateMemberDto) {}
