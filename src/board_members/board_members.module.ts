import { Module } from '@nestjs/common';
import { BoardMembersService } from './board_members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardMember } from './entities/board_members.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardMember])
  ],
  providers: [BoardMembersService],
  exports: [BoardMembersService]
})
export class BoardMembersModule { }
