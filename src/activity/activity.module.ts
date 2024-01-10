import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Card } from 'src/card/entities/card.entity';
import { CardService } from 'src/card/card.service';
import { List } from 'src/list/entities/list.entity';
import { BoardMember } from 'src/board_members/entities/board_members.entity';
import { CardMember } from 'src/card/entities/card-member.entity';
import { AlramModule } from 'src/alram/alram.module';
import { AlramService } from 'src/alram/alram.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, Card, List, CardMember, BoardMember, AlramModule, User]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService, CardService, AlramService, UserService, JwtService],
  exports: [ActivityService],
})
export class ActivityModule {}
