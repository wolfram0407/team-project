import { Module } from '@nestjs/common';
import { AlramService } from './alram.service';
import { AlramController } from './alram.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alram } from './entities/alram.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Alram, User])],

  controllers: [AlramController],
  providers: [AlramService, UserService, JwtService],
  exports: [AlramService],
})
export class AlramModule {}
