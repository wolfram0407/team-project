import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateActivityDto } from './dto/update-activity.dto';
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('Activity')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @Post(':cardId')
  async create(
    @Body() CreateActivityDto: CreateActivityDto,
    @Param('cardId') cardId: number,
    @Req() req: any,
  ) {
    const { userId } = req.user;

    // const card = await this.cardService.findOne(cardId);

    // if(!card){
    //   throw new NotFoundException('카드가 존재하지 않습니다.');
    // }

    await this.activityService.create(CreateActivityDto, cardId, userId);
    return { message: '댓글이 생성되었습니다.' };
  }

  @Get(':cardId')
  async findAll(@Param('cardId') cardId: number) {
    const activity = await this.activityService.findAll(cardId);

    return { activity, message: '댓글이 조회되었습니다.' };
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

    return { message: '댓글이 수정되었습니다.' };
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

    return { message: '댓글이 삭제되었습니다.' };
  }
}
