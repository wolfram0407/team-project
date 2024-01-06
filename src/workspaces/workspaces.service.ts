import { Injectable } from '@nestjs/common';
import { ReqCreateWorkspaceDto, ReqUpdateWorkspacesDto } from './dto/req.workspace.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { EntityManager, Repository } from 'typeorm';
import { WorkspaceMember } from 'src/workspace-members/entities/workspace-member.entity';
import { WorkspaceMemberRole } from 'src/common/types/work-member-role.type';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createWorkspaceDto: ReqCreateWorkspaceDto, user: User) {
    const { userId } = user;
    // 트랜잭션 사용하여 워크스페이스 생성과 함께 워크스페이스 멤버에 추가
    await this.entityManager.transaction(async (transactionEntityManager) => {
      // 1. 워크스페이스 생성
      const workspace = await transactionEntityManager.save(Workspace, {
        ...createWorkspaceDto,
        userId,
      });

      // 2. 워크스페이스 멤버에 추가
      await transactionEntityManager.save(WorkspaceMember, {
        workspaceId: workspace.workspaceId,
        userId,
        role: WorkspaceMemberRole.Admin,
      });
    });
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
