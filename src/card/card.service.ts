import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { List } from 'src/list/entities/list.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository:Repository<Card>,
    @InjectRepository(List) private readonly listRepository:Repository<List>,  
  ){
  }

  async create(title:string, listId: number) {

    const list = await this.listRepository.findOne({where:{listId}})
    console.log(list)
    if(!list){
      throw new NotFoundException('리스트가 존재하지 않습니다.');
    }

    await this.cardRepository.save({
      title,
      listId,
    })
  }

  findAll() {
    return `This action returns all card`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
