import { PartialType, PickType } from '@nestjs/swagger';
import { Workspace } from '../entities/workspace.entity';

// 워크스페이스 생성
export class ReqCreateWorkspaceDto extends PickType(Workspace, ['title', 'description']) {}

// 워크스페이스 수정
export class ReqUpdateWorkspacesDto extends PartialType(ReqCreateWorkspaceDto) {}
