import { Module } from '@nestjs/common';
import { CardMembersService } from './card_members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardMember } from 'src/board_members/entities/board_members.entity';
import { Card } from 'src/card/entities/card.entity';
import { CardModule } from 'src/card/card.module';
import { CardMember } from './entities/card-member.entity';
import { BoardMembersModule } from 'src/board_members/board_members.module';

@Module({
  imports: [
    BoardMembersModule,
    TypeOrmModule.forFeature([BoardMember, Card, CardMember]),
    CardModule,
  ],
  providers: [CardMembersService,],
  exports: [CardMembersService]
})
export class CardMembersModule { }
