import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ActivityService } from "./activity.service";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";

@Controller()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post(":cardId")
  async create(
    @Body() CreateActivityDto: CreateActivityDto,
    @Param("cardId") cardId: number,
    @Req() req: any
  ) {
    const user = req.user;
    const card = await this.cardService.findOne(cardId);

    return this.activityService.create(CreateActivityDto, card, user.userId);
  }

  @Patch(":cardId/:activityId")
  update(
    @Param("activityId") activityId: string,
    @Body() updateActivityDto: UpdateActivityDto
  ) {
    return this.activityService.update(+activityId, updateActivityDto);
  }

  @Delete(":cardId/:activityId")
  remove(@Param("activityId") activityId: string) {
    return this.activityService.delete(+activityId);
  }
}
