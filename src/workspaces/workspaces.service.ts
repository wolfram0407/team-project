import { Injectable } from '@nestjs/common';
import { ReqCreateWorkspaceDto, ReqUpdateWorkspacesDto } from './dto/req.workspace.dto';

@Injectable()
export class WorkspaceService {
  create(createWorkspaceDto: ReqCreateWorkspaceDto) {
    return 'This action adds a new workspace';
  }

  findAll() {
    return `This action returns all workspace`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workspace`;
  }

  update(id: number, updateWorkspaceDto: ReqUpdateWorkspacesDto) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
