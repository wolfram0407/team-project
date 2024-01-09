import { Controller, Param, Sse } from '@nestjs/common';
import { AlramService } from './alram.service';

@Controller('alram')
export class AlramController {
  constructor(private readonly alramService: AlramService) {}

  @Sse(':userId')
  sendClientAlarm(@Param('userId') userId: string) {
    return this.alramService.sendClientAlarm(+userId);
  }
}
