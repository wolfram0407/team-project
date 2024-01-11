import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Card } from 'src/card/entities/card.entity';
import { CardService } from 'src/card/card.service';
import { List } from 'src/list/entities/list.entity';
import { BoardMember } from 'src/board_members/entities/board_members.entity';
import { CardMember } from 'src/card_members/entities/card-member.entity';
import { ListService } from 'src/list/list.service';
import { Board } from 'src/board/entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Card, List, CardMember, BoardMember, Board])],
  controllers: [ActivityController],
  providers: [ActivityService, CardService, ListService],
  exports: [ActivityService],
})
export class ActivityModule {}
