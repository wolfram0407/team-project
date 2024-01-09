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


  async findAll(listId: number) {
    const cards =  await this.cardRepository.find({
      where: {listId}
    });

    return cards
  }

  async findOne(id: number) {
    const card = await this.cardRepository.findOneBy({id})
   
    return card
  }

  async update(id: number, updateCardDto: UpdateCardDto) {
    const {title, description, notice, label, start_date, end_date, image_path} = updateCardDto;  
  
    const card = await this.cardRepository.findOne({
      where: {id}
    })

    if(!card){
      throw new NotFoundException('카드가 존재하지 않습니다.')
    }
    
    const updatedCard = await this.dataSource.createQueryBuilder().update(Card).set({
      title, description, notice, label, start_date, end_date, image_path     
    }).where(`id= ${id}`).execute()
    
    
    return updatedCard;
  }

  async remove(id: number) {
    const card = await this.cardRepository.findOne({where: {id}})
    
    if(!card){
      return await this.cardRepository.restore(id)
    }
    
    const deletedCard = await this.cardRepository.softDelete({id})

    return deletedCard;
  }

}
