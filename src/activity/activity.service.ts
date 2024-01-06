import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async create(CreateActivityDto: CreateActivityDto, card_id: number, user_id: number) {
    if (!CreateActivityDto.content) {
      return '빈칸을 채워주세요.';
    }

    await this.activityRepository.save({
      content: CreateActivityDto.content,
      card_id,
      user_id,
    });
  }

  async findOne(activity_id: number) {
    return await this.activityRepository.findOne({ where: { activity_id } });
  }

  async update(activity_id: number, updateActivityDto: UpdateActivityDto) {
    await this.activityRepository.update({ activity_id }, updateActivityDto);
  }

  async delete(activity_id: number) {
    await this.activityRepository.delete({ activity_id });
  }
}
