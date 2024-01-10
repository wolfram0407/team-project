import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CardService } from '../card/card.service';
import { AlramService } from 'src/alram/alram.service';
import { UserService } from 'src/user/user.service';
import { alramActivityDto } from './dto/alram-activity.dto';

@ApiBearerAuth()
@ApiTags('Activity')
@Controller('activity')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly cardService: CardService,
    private readonly alramService: AlramService,
    private readonly userService: UserService,
  ) {}

  @Post(':cardId')
  async create(
    @Body() CreateActivityDto: CreateActivityDto,
    @Param('cardId') cardId: number,
    @Req() req: any,
  ) {
    const { userId } = req.user;

    const card = await this.cardService.findOne(cardId);

    if (!card) {
      throw new NotFoundException('카드가 존재하지 않습니다.');
    }

    await this.activityService.create(CreateActivityDto, cardId, userId);
    return {
      success: 'true',
      message: '댓글 생성 완료',
    };
  }

  @Get(':cardId')
  async findAll(@Param('cardId') cardId: number) {
    const activity = await this.activityService.findAll(cardId);

    const card = await this.cardService.findOne(cardId);

    if (!card) {
      throw new NotFoundException('카드가 존재하지 않습니다.');
    }

    return {
      success: 'true',
      message: '댓글 조회 완료',
      data: activity,
    };
  }

  @Patch(':cardId/:activityId')
  async update(
    @Param('activityId') activityId: number,
    @Body() updateActivityDto: UpdateActivityDto,
    @Req() req: any,
  ) {
    const { userId } = req.user;

    const activity = await this.activityService.findOne(+activityId);

    if (!activity) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
    }

    if (activity.userId !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.activityService.update(+activityId, updateActivityDto);

    return {
      success: 'true',
      message: '댓글 수정 완료',
    };
  }

  @Delete(':cardId/:activityId')
  async delete(@Param('activityId') activityId: number, @Req() req: any) {
    const { userId } = req.user;

    const activity = await this.activityService.findOne(+activityId);

    if (!activity) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
    }

    if (activity.userId !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.activityService.delete(+activityId);
    return {
      success: 'true',
      message: '댓글 삭제 완료',
    };
  }

  @Post('alram')
  async reqUser(@Body() alramActivityDto: alramActivityDto, @Req() req: any) {
    const { userId } = req.user;

    const user = await this.userService.findUserById(alramActivityDto.userId);
    console.log(user);

    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    // 카드 업데이트시 이벤트 발생
    const data = await this.alramService.emitUserEvent(alramActivityDto.userId);
    console.log(data);
    return {
      message: 'haha',
    };
  }
}
