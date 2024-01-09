import { Module } from '@nestjs/common';
import { AlramService } from './alram.service';
import { AlramController } from './alram.controller';

@Module({
  controllers: [AlramController],
  providers: [AlramService],
})
export class AlramModule {}
