import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { DataSource, Repository } from 'typeorm';
import { List } from 'src/list/entities/list.entity';
import { MoveCardDto } from './dto/move-card.dto';

@Injectable()
export class CardService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(List) private readonly listRepository: Repository<List>,
  ) {}

  async create(title: string, listId: number) {
    const list = await this.listRepository.findOne({
      where: { listId },
    });
    console.log(list);
    if (!list) {
      throw new NotFoundException('리스트가 존재하지 않습니다.');
    }

    const lastestCard = await this.cardRepository.maximum('position', { listId });

    await this.cardRepository.save({
      title,
      listId,
      position: lastestCard + 1,
    });
  }

  async findAll(listId: number) {
    const cards = await this.cardRepository.find({
      where: { listId },
    });

    return cards;
  }

  async findOne(id: number) {
    const card = await this.cardRepository.findOneBy({ id });

    return card;
  }

  async update(id: number, updateCardDto: UpdateCardDto) {
    const { title, description, notice, label, start_date, end_date, image_path } = updateCardDto;

    const card = await this.cardRepository.findOne({
      where: { id },
    });

    if (!card) {
      throw new NotFoundException('카드가 존재하지 않습니다.');
    }

    return await this.dataSource
      .createQueryBuilder()
      .update(Card)
      .set({
        title,
        description,
        notice,
        label,
        start_date,
        end_date,
        image_path,
      })
      .where(`id= ${id}`)
      .execute();
  }

  async moveCard(id: number, list_id: number, moveCardDto: MoveCardDto) {
    const { position } = moveCardDto;

    const card = await this.cardRepository.findOne({
      where: { id },
    });

    if (!card) {
      throw new NotFoundException('카드가 존재하지 않습니다.');
    }

    // const toChangeList = await this.listRepository.findOne({where:{listId: list_id}})

    const lastestCard = await this.cardRepository.maximum('position', { listId: list_id });

    //트랜잭션 필요함
    //카드를 뒤로 이동할때

    //동일한 리스트 내에서 이동할 경우
    if (list_id === card.listId) {
      if (lastestCard < position) {
        throw new BadRequestException('최대 포지션 값을 넘을 수 없습니다');
      } else if (position < 1) {
        throw new BadRequestException('포지션 값은 1보다 작을 수 없습니다');
      }

      if (card.position < position) {
        await this.dataSource
          .createQueryBuilder()
          .update(Card)
          .set({
            position: () => 'position - 1',
          })
          .where(`position <=${position} && position > ${card.position} && list_Id = ${list_id}`)
          .execute();

        const updatedCard = await this.dataSource
          .createQueryBuilder()
          .update(Card)
          .set({
            listId: list_id,
            position,
          })
          .where(`id= ${id}`)
          .execute();

        return updatedCard;
      } else if (card.position > position) {
        await this.dataSource
          .createQueryBuilder()
          .update(Card)
          .set({
            position: () => 'position + 1',
          })
          .where(`position >=${position} && position < ${card.position} && list_id = ${list_id}`)
          .execute();

        const updatedCard = await this.dataSource
          .createQueryBuilder()
          .update(Card)
          .set({ listId: list_id, position })
          .where(`id= ${id}`)
          .execute();

        return updatedCard;
      }
    } else if (list_id !== card.listId) {
      //다른 리스트로 이동할 경우

      if (position > lastestCard + 1 || position < 1) {
        throw new BadRequestException('올바르지 않은 위치값 입니다.');
      }

      await this.dataSource
        .createQueryBuilder()
        .update(Card)
        .set({
          position: () => 'position + 1',
        })
        .where(`position >= ${position} && list_id = ${list_id}`)
        .execute();

      //움직이려는 카드보다 포지션 값이 높은 기존에 존재하던 리스트의 카드들 position값 -1
      await this.dataSource
        .createQueryBuilder()
        .update(Card)
        .set({
          position: () => 'position -1',
        })
        .where(`position > ${card.position} && list_id = ${card.listId}`)
        .execute();

      const updatedCard = await this.dataSource
        .createQueryBuilder()
        .update(Card)
        .set({ listId: list_id, position })
        .where(`id= ${id}`)
        .execute();

      return updatedCard;
    }
  }

  async remove(id: number) {
    const card = await this.cardRepository.findOne({ where: { id } });

    if (!card) {
      const card = await this.cardRepository.findOne({ where: { id }, withDeleted: true });

      await this.dataSource
        .createQueryBuilder()
        .update(Card)
        .set({
          position: () => 'position + 1',
        })
        .where(`position >= ${card.position} and deleted_at is null `)
        .execute();

      await this.cardRepository.restore(id);

      return card;
    }

    await this.dataSource
      .createQueryBuilder()
      .update(Card)
      .set({
        position: () => 'position - 1',
      })
      .where(`position > ${card.position} `)
      .execute();

    const deletedCard = await this.cardRepository.softDelete({ id });

    return deletedCard;
  }
}
