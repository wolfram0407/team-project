import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardMember } from './entities/board_members.entity';
import { IsNull, Not, Repository, createQueryBuilder } from 'typeorm';
import { BoardMemberRole } from 'src/common/types/boardMember.type';

@Injectable()
export class BoardMembersService
{
  constructor(
    @InjectRepository(BoardMember)
    private boardMembersRepository: Repository<BoardMember>,
  )
  {
  }

  async create(userId: number, boardId: number, role: BoardMemberRole)
  {

    const member = this.boardMembersRepository.create({
      role,
      user: { userId },
      boards: { boardId }
    })
    const boardMember = await this.boardMembersRepository.save(member)

    return boardMember
  }

  // 보드 멤버 생성 
  async addMember(userId: number, boardId: number, role: BoardMemberRole)
  {
    const checkMember = await this.boardMembersRepository
      .createQueryBuilder('bm')
      .where('bm.user_id = :user_id', { user_id: userId })
      .andWhere('bm.board_id = :board_id', { board_id: boardId })
      .getOne()

    if (checkMember)
      throw new ConflictException('이미 등록된 유저')

    return await this.create(userId, boardId, role)
  }
  // 보드 아이디로 멤버 조회
  async findBoardMembers(boardId: number)
  {
    const temp = await this.boardMembersRepository
      .createQueryBuilder('member')
      .where('member.deleted_at is null')
      .andWhere('member.board_id = :boardId', { boardId: boardId })
      .getMany()

    return temp

  }
  // 보드 아이디로 멤버 조회
  async findOneBoardMember(boardId: number, userId: number)
  {
    const temp = await this.boardMembersRepository
      .createQueryBuilder('member')
      .where('member.deleted_at is null')
      .andWhere('member.board_id = :boardId', { boardId: boardId })
      .andWhere('member.user_id = :userId', { userId: userId })
      .getOne()

    return temp

  }

  //보드멤버 수정
  async updateMember(boardId: number, userId: number, role: BoardMemberRole)
  {
    const member = await this.findBoardMembers(boardId)
    member.find((member) => member.user_id === userId).role = role
    await this.boardMembersRepository.save(member)
  }

  // 보드 멤버 탈퇴
  async deleteMember(boardId: number, userId: number)
  {
    const checkBoardMember = await this.boardMembersRepository.findOne({
      where: {
        user_id: userId,
        board_id: boardId
      }
    })
    if (!checkBoardMember)
    {
      throw new NotFoundException()
    }

    const deleteMember = await this.boardMembersRepository.softDelete({
      boardMemberId: checkBoardMember.boardMemberId,
      user_id: userId,
    })
    if (!deleteMember)
    {
      // 에러처리 필요!
      throw new NotFoundException('에러수정 필요!')
    }
    return {
      message: 'successfully deleted member '
    }
  }


}
