import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { DataSource, Repository } from 'typeorm';
import { MoveCardDto } from './dto/move-card.dto';
import { ListService } from 'src/list/list.service';

@Injectable()
export class CardService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly listService: ListService,
    @InjectRepository(Card) private readonly cardRepository:Repository<Card>,
    // @InjectRepository(List) private readonly listRepository:Repository<List>,   
  ){
  }

  

  async create(title:string, listId: number) {

    //리스트 서비스 구현 되면 의존성 변경
    const list = await this.listService.findOne(listId)
    
    if(!list){
      throw new NotFoundException('리스트가 존재하지 않습니다.');
    }

    const lastestCard = await this.cardRepository.maximum("position", {listId})

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
    const {title, description, notice, label, start_date, end_date, image_path} = updateCardDto;  
  
    const card = await this.cardRepository.findOne({
      where: {id}
    })

    if(!card){
      throw new NotFoundException('카드가 존재하지 않습니다.')
    }

    return await this.dataSource.createQueryBuilder().update(Card).set({
      title, description, notice, label, start_date, end_date, image_path     
    }).where(`id= ${id}`).execute()   
    
 }

  async moveCard(id: number, list_id:number, moveCardDto: MoveCardDto){
    
    const list = await this.listService.findOne(list_id)
    
    if(!list){
      throw new NotFoundException('리스트가 존재하지 않습니다.');
    }


    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
        
    const {position} = moveCardDto;
    
     const card = await this.cardRepository.findOne({
       where: {id}
    })


    if(!card){
      throw new NotFoundException('카드가 존재하지 않습니다.')
    }  
    const lastestCard = await this.cardRepository.maximum("position", {listId: list_id})

    await queryRunner.startTransaction();
    
    try{
      if(list_id === card.listId){
      
        if(lastestCard < position){
          throw new BadRequestException('최대 포지션 값을 넘을 수 없습니다')
        } else if(position< 1){
          throw new BadRequestException('포지션 값은 1보다 작을 수 없습니다')
        }
  
  
        if(card.position < position){
                   
          await this.dataSource.manager
          .createQueryBuilder()
          .update(Card)
          .set({ position: ()=> "position - 1" })
          .where(`position <=${position} && position > ${card.position} && list_Id = ${list_id}`)
          .execute()


         await this.dataSource.manager
         .createQueryBuilder()
         .update(Card).set({
            listId: list_id,
            position     
          })
          .where(`id= ${id}`)
          .execute()
    
          await queryRunner.commitTransaction()
    
        }else if(card.position > position){      
          await this.dataSource
          .manager
          .createQueryBuilder()
          .update(Card)
          .set({ position: ()=> "position + 1"})
          .where(`position >=${position} && position < ${card.position} && list_id = ${list_id}`).execute()
    
         await this.dataSource.manager
         .createQueryBuilder()
         .update(Card)
         .set({ listId:list_id, position })
         .where(`id= ${id}`)
         .execute()
         
         await queryRunner.commitTransaction();

        }
      } else if(list_id !== card.listId){      //다른 리스트로 이동할 경우  
        
        if(position > lastestCard + 1 || position < 1) {
          throw new BadRequestException('올바르지 않은 위치값 입니다.')
        }
  
  
        await this.dataSource.manager
          .createQueryBuilder()
          .update(Card)
          .set({
          position: ()=> "position + 1"
          })
          .where(`position >= ${position} && list_id = ${list_id}`)
          .execute()
  
          //움직이려는 카드보다 포지션 값이 높은 기존에 존재하던 리스트의 카드들 position값 -1 
          await this.dataSource.manager
          .createQueryBuilder()
          .update(Card)
          .set({
          position: ()=> "position -1"
          })
          .where(`position > ${card.position} && list_id = ${card.listId}`)
          .execute()
        
    
        await this.dataSource.manager
        .createQueryBuilder()
        .update(Card)
        .set({ listId:list_id, position })
        .where(`id= ${id}`)
        .execute()
        
        await queryRunner.commitTransaction() 
     
      }


    }catch (err){
      await queryRunner.rollbackTransaction()
      return '카드 이동 실패'
    }finally {
      await queryRunner.release();
      return '카드 이동 성공'
    }
  }


  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
  
    try {
      await queryRunner.startTransaction();
  
      const card = await this.cardRepository.findOne({ where: { id } });
  
      if (!card) {
        // 삭제된 카드를 찾을 때 withDeleted 옵션을 사용합니다.
        const deletedCard = await this.cardRepository.findOne({
          where: { id },
          withDeleted: true,
        });
  
        if (deletedCard) {
          await this.dataSource.manager
            .createQueryBuilder()
            .update(Card)
            .set({
              position: () => "position + 1",
            })
            .where(`position >= ${deletedCard.position} AND deleted_at IS NULL`)
            .execute();
  
          await this.dataSource.manager
            .getRepository(Card)
            .createQueryBuilder()
            .restore()
            .where("id = :id", { id })
            .execute();
        } else {
          throw new NotFoundException('복구하려는 카드가 존재하지 않습니다.')
        }
      } else {
        await this.dataSource.manager
          .createQueryBuilder()
          .update(Card)
          .set({
            position: () => "position - 1",
          })
          .where(`position > ${card.position}`)
          .execute();
  
        await this.dataSource.manager
          .getRepository(Card)
          .createQueryBuilder()
          .softDelete()
          .where("id = :id", { id })
          .execute();
      }
  
      await queryRunner.commitTransaction();
  
      return "카드 삭제 또는 복구 성공";
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      return "카드 삭제 실패";
    } finally {
      await queryRunner.release();
    }
  }

}