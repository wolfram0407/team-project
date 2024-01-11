import { ActivityModule } from './../activity/activity.module';
import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardMembersModule } from 'src/board_members/board_members.module';
import { WorkspaceModule } from 'src/workspaces/workspaces.module';
import { WorkspaceMembersModule } from 'src/workspace-members/workspace-members.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    BoardMembersModule,
    TypeOrmModule.forFeature([Board]),
    WorkspaceModule,
    WorkspaceMembersModule,
    ActivityModule
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule { }
