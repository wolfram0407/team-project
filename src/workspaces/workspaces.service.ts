import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
      const workspace: Workspace = await transactionEntityManager.save(Workspace, {
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

  async findAll(userId: number) {
    const workspaces: Workspace[] = await this.workspaceRepository
      .createQueryBuilder('workspace')
      .leftJoinAndSelect('workspace.workspaceMembers', 'wm')
      .select(['workspace.workspaceId', 'workspace.title', 'workspace.description'])
      .where('wm.userId=:userId', { userId })
      .getMany();

    return workspaces;
  }

  async findOne(workspaceId: number, userId: number) {
    const workspace: Workspace = await this.workspaceRepository
      .createQueryBuilder('workspace')
      .leftJoinAndSelect('workspace.workspaceMembers', 'wm')
      .select(['workspace.workspaceId', 'workspace.title', 'workspace.description', 'wm.userId'])
      .where('wm.workspaceId=:workspaceId', { workspaceId })
      .getOne();

    if (!workspace) {
      throw new NotFoundException('해당하는 워크스페이스를 찾을 수 없습니다.');
    }

    // 해당 워크스페이스에 해당하는 사람이 아니면 조회 불가 !
    const isMember: boolean = this.checkMember(userId, workspace.workspaceMembers);
    if (!isMember) {
      throw new UnauthorizedException('해당 워크스페이스의 소속된 멤버가 아닙니다.');
    }

    return workspace;
  }

  async update(workspaceId: number, updateWorkspaceDto: ReqUpdateWorkspacesDto, userId: number) {
    const { title, description } = updateWorkspaceDto;

    const workspace = await this.findOne(workspaceId, userId);

    const newTitle: string = title ? title : workspace.title;
    const newDescription: string = description ? description : workspace.description;

    await this.workspaceRepository.update(
      {
        workspaceId,
      },
      {
        title: newTitle,
        description: newDescription,
      },
    );
  }

  async remove(workspaceId: number, userId: number) {
    const workspace = await this.workspaceRepository.findOne({
      where: { workspaceId, userId },
      relations: ['workspaceMembers'],
    });

    await this.workspaceRepository.softRemove(workspace);
  }

  checkMember(userId: number, workspaceMemebers: WorkspaceMember[]) {
    for (const member of workspaceMemebers) {
      if (member.userId === userId) {
        return true;
      }
    }
    return false;
  }
}
