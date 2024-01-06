import { PickType } from '@nestjs/swagger';
import { WorkspaceMember } from '../entities/workspace-member.entity';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ReqCreateWorkspaceMemberDto extends PickType(WorkspaceMember, ['role']) {
  /**
   * 초대 이메일
   * @example "test@test.com"
   * @requires true
   */
  @IsEmail({}, { message: '이메일 형식이 잘못됐습니다.' })
  @IsNotEmpty({ message: '초대할 이메일을 입력해주세요.' })
  email: string;
}

export class ReqUpdateWorkspaceMemberDto extends PickType(WorkspaceMember, ['role']) {}
