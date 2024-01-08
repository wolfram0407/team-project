import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardMember } from './entities/board_members.entity';
import { Repository } from 'typeorm';
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

  // 보드 아이디로 멤버 조회


  // 


}
