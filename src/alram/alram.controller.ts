import { Body, Controller, NotFoundException, Param, Post, Req, Sse } from '@nestjs/common';
import { AlramService } from './alram.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateAlramDto } from './dto/create-alram.dto';
@ApiBearerAuth()
@ApiTags('Alram')
@Controller('alram')
export class AlramController {
  constructor(private readonly alramService: AlramService) {}

  @Post(':cardId')
  async reqUser(
    @Body() CreateAlramDto: CreateAlramDto,
    @Param('cardId') cardId: number,
    @Req() req: any,
  ) {
    const { userId } = req.user;

    // const card = await this.cardService.findOne(cardId);

    // if (!card) {
    //   throw new NotFoundException('카드가 존재하지 않습니다.');
    // }

    this.alramService.emitUserEvent({ userId, comment: CreateAlramDto });

    (await this.alramService.sendClientAlarm(userId)).subscribe((notification) => {
      console.log('Notification sent:', notification);
    });

    return {
      success: 'true',
      message: `${userId}가 ${CreateAlramDto.name}님을 요청했습니다.`,
    };
  }
}
