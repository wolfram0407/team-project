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

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Card, List, CardMember, BoardMember])],
  controllers: [ActivityController],
  providers: [ActivityService, CardService],
  exports: [ActivityService],
})
export class ActivityModule {}
