import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

// 워크스페이스 생성
export class ReqCreateWorkspaceDto {
  @ApiProperty({ required: true, example: 'Workspace_Title_1' })
  @IsString()
  @IsNotEmpty({ message: '워크스페이스 제목을 입력해주세요.' })
  title: string;

  @ApiProperty({ required: false, example: 'This is Workspace for 기탄신기' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class ReqUpdateWorkspacesDto extends PartialType(ReqCreateWorkspaceDto) {}
