import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { BoardMember } from 'src/board_members/entities/board_members.entity';
import { CardMembersService } from 'src/card_members/card_members.service';
import { CardMember } from 'src/card_members/entities/card-member.entity';
import { ListModule } from 'src/list/list.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card, BoardMember, CardMember]),ListModule
],
  controllers: [CardController],
  providers: [CardService, CardMembersService],
  exports: [CardService]
})
export class CardModule {}
