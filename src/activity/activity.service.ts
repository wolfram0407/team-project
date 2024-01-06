import { Injectable } from "@nestjs/common";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";
import { Activity } from "./entities/activity.entity";

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity> // private jwtService: JwtService // JWT 토큰 생성을 위해 주입한 서비스
  ) {}

  async create(
    CreateActivityDto: CreateActivityDto,
    cardId: number,
    userId: number
  ) {
    if (!CreateActivityDto) {
      return "빈칸을 채워주세요.";
    }

    await this.activityRepository.save({
      CreateActivityDto,
      cardId,
      userId,
    });
  }

  async update(activityId: number, updateActivityDto: UpdateActivityDto) {
    await this.activityRepository.update({ activityId }, updateActivityDto);
  }

  async delete(activityId: number) {
    await this.activityRepository.delete({ activityId });
  }
}
