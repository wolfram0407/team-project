import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, QueryRunner } from 'typeorm';
import { MoveListDto } from './dto/move-list.dto';
import { List } from './entities/list.entity';
import { CreateListDto, UpdateListDto } from './dto/req-list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    private connection: Connection,
  ) {}

  async create(createListDto: CreateListDto) {
    const { ...restOfList } = createListDto;

    const list = await this.listRepository.save({
      ...restOfList,
    });

    return list;
  }

  // findAll() {
  //   return `This action returns all list`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} list`;
  // }

  async update(id: number, updateListDto: UpdateListDto) {
    const listToUpdate = await this.listRepository.findOne({ where: { listId: id } });
    if (!listToUpdate) {
      throw new NotFoundException(`List not found with id ${id}`);
    }

    const updatedList = await this.listRepository.save({
      ...listToUpdate,
      ...updateListDto,
    });

    return updatedList;
  }

  async remove(id: number) {
    const listToRemove = await this.listRepository.findOne({ where: { listId: id } }); // findOne 으로 삭제할 컬럼 찾기
    if (!listToRemove) {
      throw new NotFoundException(`List not found with id ${id}`);
    }

    await this.listRepository.remove(listToRemove); // remove 메소드 사용하여 찾은 해당 컬럼 삭제
    return { message: `List with id ${id} removed successfully` };
  }

  async move(listId: number, boardId: number, moveListDto: MoveListDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const list = await this.listRepository.findOne({ where: { listId } });
      if (!list) {
        throw new NotFoundException(`List not found with id ${listId}`);
      }

      const currentPosition = list.position;
      await this.listRepository.update(listId, { position: moveListDto.newPosition });

      // 다른 목록의 위치 업데이트
      if (currentPosition < moveListDto.newPosition) {
        // 목록이 아래로 이동
        await this.updatePositionsDecrease(
          currentPosition,
          moveListDto.newPosition,
          boardId,
          queryRunner,
        );
      } else {
        // 목록이 위로 이동
        await this.updatePositionsIncrease(
          currentPosition,
          moveListDto.newPosition,
          boardId,
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();
      return this.listRepository.findOne({ where: { listId } });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async updatePositionsDecrease(
    startPos: number,
    endPos: number,
    boardId: number,
    queryRunner: QueryRunner,
  ) {
    for (let pos = startPos + 1; pos <= endPos; pos++) {
      await queryRunner.manager.increment(
        List,
        { boardId: boardId, position: pos },
        'position',
        -1,
      );
    }
  }

  private async updatePositionsIncrease(
    startPos: number,
    endPos: number,
    boardId: number,
    queryRunner: QueryRunner,
  ) {
    for (let pos = endPos; pos < startPos; pos++) {
      await queryRunner.manager.increment(List, { boardId: boardId, position: pos }, 'position', 1);
    }
  }
}
