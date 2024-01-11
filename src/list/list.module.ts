import { ActivityModule } from 'src/activity/activity.module';
import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Board } from 'src/board/entities/board.entity';
import { Card } from 'src/card/entities/card.entity';
import { BoardModule } from 'src/board/board.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([List, Board, Card])],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService]
})
export class ListModule { }
