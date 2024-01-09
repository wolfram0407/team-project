import { Injectable  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardMember } from './entities/card-member.entity';
import { Repository } from 'typeorm';
import { BoardMember } from 'src/board_members/entities/board_members.entity';

@Injectable()
export class CardMembersService {
  constructor(
    @InjectRepository(CardMember)  private cardMemberRepository: Repository<CardMember>,
    @InjectRepository(BoardMember) private readonly boardMemberRepsitory: Repository<BoardMember>
  ){}

    
  async addCardMember(cardId: number, boardMemberId: number){
   
    const boardMember = await this.boardMemberRepsitory.findOne({where: {boardMemberId}})
        

    return await this.cardMemberRepository.save({
      card_id: cardId,
      boardMember
    })
  }

  async removeCardMember(id: number){
    await this.cardMemberRepository.delete({id})
  }}