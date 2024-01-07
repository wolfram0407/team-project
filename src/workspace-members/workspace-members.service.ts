import { Injectable } from '@nestjs/common';
import { ReqCreateWorkspaceMemberDto } from './dto/req.work-member.dto';
import { ReqUpdateWorkspaceMemberDto } from './dto/req.work-member.dto';

@Injectable()
export class WorkspaceMembersService {
  create(createWorkspaceMemberDto: ReqCreateWorkspaceMemberDto) {
    return 'This action adds a new workspaceMember';
  }

  findAll() {
    return `This action returns all workspaceMembers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workspaceMember`;
  }

  update(id: number, updateWorkspaceMemberDto: ReqUpdateWorkspaceMemberDto) {
    return `This action updates a #${id} workspaceMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspaceMember`;
  }
}
