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

  async create(CreateActivityDto: CreateActivityDto, cardId: number, userId: number) {
    if (!CreateActivityDto.content) {
      return '빈칸을 채워주세요.';
    }

    await this.activityRepository.save({
      content: CreateActivityDto.content,
      cardId,
      userId,
    });
  }

  async findOne(activityId: number) {
    return await this.activityRepository.findOne({ where: { activityId } });
  }

  async findAll(cardId: number) {
    return await this.activityRepository.find({ where: { cardId } });
  }

  async update(activityId: number, updateActivityDto: UpdateActivityDto) {
    await this.activityRepository.update({ activityId }, updateActivityDto);
  }

  async delete(activityId: number) {
    await this.activityRepository.delete({ activityId });
  }
}
