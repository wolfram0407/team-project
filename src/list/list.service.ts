import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, QueryRunner } from 'typeorm';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { MoveListDto } from './dto/move-list.dto';
import { List } from './entities/list.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    private connection: Connection,
  ) {}

  create(createListDto: CreateListDto) {
    return 'This action adds a new list';
  }

  findAll() {
    return `This action returns all list`;
  }

  findOne(id: number) {
    return `This action returns a #${id} list`;
  }

  update(id: number, updateListDto: UpdateListDto) {
    return `This action updates a #${id} list`;
  }

  remove(id: number) {
    return `This action removes a #${id} list`;
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

      // Update positions of other lists
      if (currentPosition < moveListDto.newPosition) {
        // List moves down
        await this.updatePositionsDecrease(
          currentPosition,
          moveListDto.newPosition,
          boardId,
          queryRunner,
        );
      } else {
        // List moves up
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
    // Logic to decrease positions of other lists
  }

  private async updatePositionsIncrease(
    startPos: number,
    endPos: number,
    boardId: number,
    queryRunner: QueryRunner,
  ) {
    // Logic to increase positions of other lists
  }
}
