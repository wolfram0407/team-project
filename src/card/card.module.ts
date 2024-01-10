import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { List } from 'src/list/entities/list.entity';
import { BoardMember } from 'src/board_members/entities/board_members.entity';
import { CardMembersService } from 'src/card_members/card_members.service';
import { CardMember } from 'src/card_members/entities/card-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, List, BoardMember, CardMember])
],
  controllers: [CardController],
  providers: [CardService, CardMembersService],
})
export class CardModule {}
