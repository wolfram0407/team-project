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

  findAll() {
    return `This action returns all workspaceMembers`;
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

  update(id: number, updateWorkspaceMemberDto: ReqUpdateWorkspaceMemberDto) {
    return `This action updates a #${id} workspaceMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspaceMember`;
  }
}
