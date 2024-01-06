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
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateActivityDto } from './dto/update-activity.dto';

@ApiTags('Activity')
@Controller()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post(':cardId')
  async create(
    @Body() CreateActivityDto: CreateActivityDto,
    @Param('cardId') card_id: number,
    @Req() req: any,
  ) {
    const { user_id } = req.user;

    // const card = await this.cardService.findOne(cardId);

    // if(!card){
    //   throw new NotFoundException('카드가 존재하지 않습니다.');
    // }

    await this.activityService.create(CreateActivityDto, card_id, user_id);
    return { message: '댓글이 생성되었습니다.' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':cardId/:activityId')
  async update(
    @Param('activityId') activity_id: number,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    const activity = await this.activityService.findOne(+activity_id);
    if (!activity) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
    }

    await this.activityService.update(+activity_id, updateActivityDto);

    return { message: '댓글이 수정되었습니다.' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':cardId/:activityId')
  async delete(@Param('activityId') activity_id: number) {
    const activity = await this.activityService.findOne(+activity_id);
    if (!activity) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
    }

    await this.activityService.delete(+activity_id);

    return { message: '댓글이 삭제되었습니다.' };
  }
}
