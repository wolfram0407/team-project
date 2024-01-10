import { UserService } from 'src/user/user.service';
import { Workspace } from 'src/workspaces/entities/workspace.entity';
import { WorkspaceService } from './../workspaces/workspaces.service';
import { AddMemberDto } from './dto/req.board';
import { Board } from 'src/board/entities/board.entity';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BoardMember } from 'src/board_members/entities/board_members.entity';
import { BoardMemberRole } from 'src/common/types/boardMember.type';
import { BoardMembersService } from 'src/board_members/board_members.service';
import { BoardGrade } from 'src/common/types/boardGrade.type';
import { WorkspaceMembersService } from 'src/workspace-members/workspace-members.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    private boardMembersService: BoardMembersService,
    private readonly workspaceService: WorkspaceService,
    private readonly workspaceMembersService: WorkspaceMembersService,
    private readonly userService: UserService,
  ) {}
  async create(workSpaceId: number, userId: number, title: string, image_path: string) {
    // 워크스페이스 멤버 전체 리드온니 등급으로 추가
    // 유로버전 로직 구현 필요!

    const workspace = await this.workspaceService.findOneByWorkspaceIdAndUserId(
      workSpaceId,
      userId,
    );
    const boardEntity = this.boardRepository.create({
      title,
      image_path,
      workspace: { workspaceId: workspace.workspaceId },
    });

    const board = await this.boardRepository.save(boardEntity);
    const boardMember = await this.boardMembersService.create(
      userId,
      board.boardId,
      BoardMemberRole.Admin,
    );

    if (!boardMember || !board) {
      //  에러 처리 필요!(커스텀)
      throw NotAcceptableException;
    }
    return {
      message: '보드를 생성했습니다!',
    };
  }

  // 보드 전체 조회
  async findAll(userId: number) {
    // 멤버로 되어 있는 보드 조회
    const boards = await this.boardRepository.find({
      relations: {
        boardMember: true,
      },
      where: {
        boardMember: {
          user: { userId },
        },
      },
    });
    return boards;
  }

  // 보드 1개 조회
  async findOne(boardId: string, userId: number) {
    const board = await this.boardRepository
      .createQueryBuilder('boards')
      .leftJoinAndSelect('boards.boardMember', 'boardMember')
      .where('boards.title = :title', { title: boardId })
      .getMany();

    return board;
  }

  // 보드 제목 검색
  async searchBoard(search: string) {
    const board = await this.boardRepository
      .createQueryBuilder('boards')
      .where('boards.title like :search', { search: `%${search}%` })
      .getMany();
    return board;
  }

  async updateBoard(id: number, title: string, image_path: string) {
    const board = await this.boardRepository.findOne({
      where: { boardId: id },
    });
    if (!board) {
      throw new NotFoundException();
    }

    const updateBoard = await this.boardRepository.update(
      { boardId: id },
      {
        title,
        image_path,
      },
    );
    if (!updateBoard) {
      // 디비 에러 처리 필요!
      throw new NotFoundException();
    }
    return {
      message: 'Board updated successfully',
    };
  }

  async deleteBoard(id: number, userId: number) {
    const board = await this.boardRepository
      .createQueryBuilder('boards')
      .leftJoinAndSelect('boards.boardMember', 'boardMember')
      .where('boards.boardId = :id', { id })
      .getOne();

    if (!board) {
      throw new NotFoundException();
    }

    if (board.boardMember[0].role == BoardMemberRole.Admin) {
      //보드 삭제
      const deleteBoard = await this.boardRepository.softDelete({
        boardId: id,
      });
      if (!deleteBoard) {
        // 디비 에러 처리 필요!
        throw new NotFoundException();
      }
      return {
        message: 'Board deleted successfully',
      };
    }

    // 보드 떠나기(테스트 필요)
    return await this.boardMembersService.deleteMember(id, userId);
  }

  // 보드 멤버 추가
  async AddMember(boardId: number, email: string, role: BoardMemberRole) {
    // 보드 아이디로 워크스페이스 멤버 조회
    // 워크스페이스 멤버 중에 있는지 검색
    // 워크스페이스 멤버가 아니면 유저에서 검색
    // 없으면 리턴

    const w_ID = await this.getBoardTOWorkSpaceId(boardId);
    const getWorkSpaceMember = await this.workspaceMembersService.findAllMemebersInWorkspace(w_ID);
    // userId 값만
    const w_Members = getWorkSpaceMember
      .map((member) => member.user)
      .map((member) => member.userId);

    // find user
    const f_user = await this.userService.findUserByEmail(email);

    const findMembers = w_Members.find((member) => member == f_user.userId);

    if (!findMembers) {
      // 없는 경우
      throw new BadRequestException('워크스페이스 먼저 등록이 되어야합니다');
    }
    //board members add
    const addBoardMember = await this.boardMembersService.addMember(f_user.userId, boardId, role);

    return addBoardMember;
  }

  private async getBoardTOWorkSpaceId(boardId: number) {
    const board = await this.boardRepository.findOne({
      where: {
        boardId,
      },
    });
    return board.workspaceId;
  }
}
