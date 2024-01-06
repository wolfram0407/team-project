import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { Workspace } from '../entities/workspace.entity';
import { ReqCreateWorkspaceMemberDto } from 'src/workspace-members/dto/req.work-member.dto';

// 워크스페이스 생성
export class ReqCreateWorkspaceDto extends PickType(Workspace, ['title', 'description']) {}

export class ReqUpdateWorkspacesDto extends PartialType(ReqCreateWorkspaceDto) {}
