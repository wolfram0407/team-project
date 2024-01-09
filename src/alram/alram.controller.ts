import { Controller, Param, Sse } from '@nestjs/common';
import { AlramService } from './alram.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags('Alram')
@Controller('alram')
export class AlramController {
  constructor(private readonly alramService: AlramService) {}

  @Sse(':userId')
  sendClientAlarm(@Param('userId') userId: string) {
    return this.alramService.sendClientAlarm(+userId);
  }
}
