import { Module } from '@nestjs/common';
import { AlramService } from './alram.service';
import { AlramController } from './alram.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alram } from './entities/alram.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alram, User])],

  controllers: [AlramController],
  providers: [AlramService],
  exports: [AlramService],
})
export class AlramModule {}
