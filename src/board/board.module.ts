import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardMembersModule } from 'src/board_members/board_members.module';
import { WorkspaceModule } from 'src/workspaces/workspaces.module';

@Module({
  imports: [BoardMembersModule, TypeOrmModule.forFeature([Board]), WorkspaceModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
