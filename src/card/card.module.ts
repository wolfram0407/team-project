import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { CardMember } from './entities/card-member.entity';
import { List } from 'src/list/entities/list.entity';
import { BoardMember } from 'src/board_members/entities/board_members.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, CardMember, List, BoardMember])],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
