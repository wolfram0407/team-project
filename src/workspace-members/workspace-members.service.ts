import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReqCreateWorkspaceMemberDto } from './dto/req.work-member.dto';
import { ReqUpdateWorkspaceMemberDto } from './dto/req.work-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class WorkspaceMembersService {
  constructor(
    @InjectRepository(WorkspaceMember)
    private readonly workspaceMemberRepository: Repository<WorkspaceMember>,
    private readonly userService: UserService,
  ) {}

  async create(createWorkspaceMemberDto: ReqCreateWorkspaceMemberDto, workspaceId: number) {
    const { email, role } = createWorkspaceMemberDto;

    // 트렐로 서비스의 회원 여부 검증
    const user: User = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('해당하는 유저를 찾을 수 없습니다.');
    }

    // 해당 유저가 워크스페이스에 이미 가입된 유저인지 검증
    const member: WorkspaceMember = await this.findMemberByWorkspaceIdAndUserId(
      workspaceId,
      user.userId,
    );
    if (member) {
      throw new BadRequestException('이미 초대된 멤버 입니다.');
    }

    await this.workspaceMemberRepository.save({
      workspaceId,
      userId: user.userId,
      role,
    });
  }

  async findAll(workspaceId: number) {
    const members: WorkspaceMember[] = await this.workspaceMemberRepository
      .createQueryBuilder('wm')
      .leftJoinAndSelect('wm.user', 'u')
      .select(['wm.workspaceId', 'wm.role', 'u.userId', 'u.email', 'u.name'])
      .where('wm.workspaceId=:workspaceId', { workspaceId })
      .getMany();
    return members;
  }

  async findMemberByWorkspaceIdAndUserId(workspaceId: number, userId: number) {
    const member: WorkspaceMember = await this.workspaceMemberRepository.findOne({
      where: {
        workspaceId,
        userId,
      },
    });

    return member;
  }

  async findMembersByName(workspaceId: number, name: string) {
    const members: WorkspaceMember[] = await this.workspaceMemberRepository
      .createQueryBuilder('wm')
      .leftJoinAndSelect('wm.user', 'u')
      .select([
        'wm.workspaceId',
        'wm.userId',
        'wm.role',
        'u.email',
        'u.name',
        'wm.createdAt',
        'wm.updatedAt',
      ])
      .where('wm.workspaceId=:workspaceId', { workspaceId })
      .andWhere('u.name LIKE :name', { name: `%${name}%` })
      .getMany();

    if (!members) {
      throw new NotFoundException('해당하는 멤버를 찾을 수 없습니다.');
    }

    return members;
  }

  async update(
    workspaceId: number,
    ReqUpdateWorkspaceMemberDto: ReqUpdateWorkspaceMemberDto,
    userId: number,
  ) {
    const { role } = ReqUpdateWorkspaceMemberDto;
    const member = await this.findMemberByWorkspaceIdAndUserId(workspaceId, userId);
    if (!member) {
      throw new NotFoundException('해당하는 멤버를 찾을 수 없습니다.');
    }

    await this.workspaceMemberRepository.update(
      {
        workspaceId,
        userId,
      },
      {
        role,
      },
    );

    return;
  }

  remove(id: number) {
    return `This action removes a #${id} workspaceMember`;
  }
}
