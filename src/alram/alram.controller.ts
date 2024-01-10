import { Body, Controller, Param, Post, Sse } from '@nestjs/common';
import { AlramService } from './alram.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAlramDto } from './dto/create-alram.dto';
import { UserService } from 'src/user/user.service';

@ApiTags('Alram')
@Controller('alram')
export class AlramController {
  constructor(
    private readonly alramService: AlramService,
    private readonly userService: UserService,
  ) {}

  @Post(':cardId')
  sendClientAlarm(@Param('cardId') cardId: string, @Body() CreateAlramDto: CreateAlramDto) {
    console.log('haha');
    const userId = this.userService.findUserById(CreateAlramDto.userId);
    return this.alramService.sendClientAlarm(+userId);
  }
}
