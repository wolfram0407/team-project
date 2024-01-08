import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { DataSource, Repository } from 'typeorm';
import { List } from 'src/list/entities/list.entity';

@Injectable()
export class CardService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Card) private readonly cardRepository:Repository<Card>,
    @InjectRepository(List) private readonly listRepository:Repository<List>,  
  ){
  }

  async create(title:string, listId: number) {

    const list = await this.listRepository.findOne({
      where:{listId}
    })
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

  async update(id: number, updateCardDto: UpdateCardDto) {
    const {description, notice, label, start_date, end_date, image_path} = updateCardDto;  
  
    const card = await this.cardRepository.findOne({
      where: {id}
    })

    if(!card){
      throw new NotFoundException('카드가 존재하지 않습니다.')
    }
    
    const updatedCard = await this.dataSource.createQueryBuilder().update(Card).set({
      description, notice, label, start_date, end_date, image_path     
    }).where(`id= ${id}`).execute()
    
    
    return updatedCard;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
