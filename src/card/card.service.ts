import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    const lastestCard = await this.cardRepository.maximum("position")

    await this.cardRepository.save({
      title,
      listId,
      position: lastestCard + 1
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
    const {title, description, notice, label, start_date, end_date, image_path, position} = updateCardDto;  
  
    const card = await this.cardRepository.findOne({
      where: {id}
    })

    if(!card){
      throw new NotFoundException('카드가 존재하지 않습니다.')
    }

    const lastestCard = await this.cardRepository.maximum("position")

    if(lastestCard < position){
      throw new BadRequestException('최대 포지션 값을 넘을 수 없습니다')
    } else if(position< 1){
      throw new BadRequestException('포지션 값은 1보다 작을 수 없습니다')
    }

    if(!position){
      return await this.dataSource.createQueryBuilder().update(Card).set({
        title, description, notice, label, start_date, end_date, image_path     
      }).where(`id= ${id}`).execute()  
    }
    
    //카드를 뒤로 이동할때
    if(card.position < position){
      await this.dataSource.createQueryBuilder().update(Card).set({
        position: ()=> "position - 1"
      }).where(`position <=${position} && position > ${card.position} `).execute()


      const updatedCard = await this.dataSource.createQueryBuilder().update(Card).set({
        title, description, notice, label, start_date, end_date, image_path, position     
      }).where(`id= ${id}`).execute()
  

      return updatedCard
    }else if(card.position > position){
      await this.dataSource
      .createQueryBuilder()
      .update(Card)
      .set({
      position: ()=> "position + 1"
      })
      .where(`position >=${position} && position < ${card.position} `).execute()

    const updatedCard = await this.dataSource.createQueryBuilder().update(Card).set({
      title, description, notice, label, start_date, end_date, image_path, position     
    }).where(`id= ${id}`).execute()

    return updatedCard
    }

    
 }



  async remove(id: number) {
    const card = await this.cardRepository.findOne({where: {id}}) 
   
    if(!card){

      const card = await this.cardRepository.findOne({where: {id},
        withDeleted: true,
      })

      console.log(card)

      await this.dataSource
      .createQueryBuilder()
      .update(Card)
      .set({
      position: ()=> "position + 1"
      })
      .where(`position >= ${card.position} and deleted_at is null `).execute()

      
      await this.cardRepository.restore(id)

   
      return card

    }
    
    await this.dataSource
    .createQueryBuilder()
    .update(Card)
    .set({
    position: ()=> "position - 1"
    })
    .where(`position > ${card.position} `).execute()
    
    const deletedCard = await this.cardRepository.softDelete({id})

    return deletedCard;
  }

}
