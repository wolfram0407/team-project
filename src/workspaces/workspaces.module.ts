import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspaces.service';
import { WorkspaceController } from './workspaces.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceMembersModule } from 'src/workspace-members/workspace-members.module';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  imports: [TypeOrmModule.forFeature([Workspace]), WorkspaceMembersModule],
})
export class WorkspaceModule {}
