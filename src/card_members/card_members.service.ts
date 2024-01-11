import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardMember } from './entities/card-member.entity';
import { Repository } from 'typeorm';
import { BoardMember } from 'src/board_members/entities/board_members.entity';
import { BoardMembersService } from 'src/board_members/board_members.service';

@Injectable()
export class CardMembersService
{
  constructor(
    // private readonly boardMemberService: BoardMembersService,
    @InjectRepository(CardMember) private cardMemberRepository: Repository<CardMember>,
    private readonly boardMembersService: BoardMembersService
  ) { }


  async addCardMember(cardId: number, boardMemberId: number)
  {

    const boardMember = await this.boardMembersService.findOneBoardMemberById(boardMemberId)
    console.log(boardMember)
    return await this.cardMemberRepository.save({
      card_id: cardId,
      boardMember
    })
  }

  async removeCardMember(id: number)
  {
    await this.cardMemberRepository.delete({ id })
  }
}
