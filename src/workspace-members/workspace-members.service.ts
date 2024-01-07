import { Injectable, NotFoundException } from '@nestjs/common';
import { ReqCreateWorkspaceMemberDto } from './dto/req.work-member.dto';
import { ReqUpdateWorkspaceMemberDto } from './dto/req.work-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspaceMembersService {
  constructor(
    @InjectRepository(WorkspaceMember)
    private readonly workspaceMemberRepository: Repository<WorkspaceMember>,
  ) {}
  create(createWorkspaceMemberDto: ReqCreateWorkspaceMemberDto) {
    return 'This action adds a new workspaceMember';
  }

  findAll() {
    return `This action returns all workspaceMembers`;
  }

  async findMyMemberInfo(workspaceId: number, userId: number) {
    const member: WorkspaceMember = await this.workspaceMemberRepository.findOne({
      where: {
        workspaceId,
        userId,
      },
    });

    if (!member) {
      throw new NotFoundException('해당하는 워크스페이스에 소속된 멤버가 아닙니다.');
    }
    return member;
  }

  update(id: number, updateWorkspaceMemberDto: ReqUpdateWorkspaceMemberDto) {
    return `This action updates a #${id} workspaceMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspaceMember`;
  }
}
