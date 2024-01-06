import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

// 워크스페이스 생성
export class ReqCreateWorkspaceDto {
  /**
   * 타이틀
   * @example "Workspace1"
   * @requires true
   */
  @IsString()
  @IsNotEmpty({ message: '워크스페이스 제목을 입력해주세요.' })
  title: string;

  /**
   * 워크스페이스 설명
   * @example "This is Workspace of 기탄신기"
   * @requires false
   */
  @IsString()
  @IsOptional()
  description?: string;
}

export class ReqUpdateWorkspacesDto extends PartialType(ReqCreateWorkspaceDto) {}
