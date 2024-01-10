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
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CardService } from '../card/card.service';

@ApiBearerAuth()
@ApiTags('Activity')
@Controller('activity')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly cardService: CardService,
  ) {}

  @ApiOperation({ summary: '카드 생성' })
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

  @ApiOperation({ summary: '카드 조회' })
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

  @ApiOperation({ summary: '카드 수정' })
  @Patch(':activityId') // 고유 값이라 cardId는 없어도 된다.
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

  @ApiOperation({ summary: '카드 삭제' })
  @Delete(':activityId')
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
}
