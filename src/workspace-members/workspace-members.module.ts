import { Module } from '@nestjs/common';
import { WorkspaceMembersService } from './workspace-members.service';
import { WorkspaceMembersController } from './workspace-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [WorkspaceMembersController],
  providers: [WorkspaceMembersService],
  imports: [TypeOrmModule.forFeature([WorkspaceMember]), UserModule],
  exports: [WorkspaceMembersService],
})
export class WorkspaceMembersModule {}
