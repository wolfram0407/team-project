import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardMembersModule } from 'src/board_members/board_members.module';

@Module({
  imports: [
    BoardMembersModule,
    TypeOrmModule.forFeature([Board])
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule { }
