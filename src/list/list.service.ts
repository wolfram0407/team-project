import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, QueryRunner } from 'typeorm';
import { MoveListDto } from './dto/move-list.dto';
import { List } from './entities/list.entity';
import { CreateListDto, UpdateListDto } from './dto/req-list.dto';
import { Board } from 'src/board/entities/board.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    private connection: Connection,
  ) {}

  async create(boardId: number, createListDto: CreateListDto) {
    // Board의 존재 여부를 확인
    const board = await this.boardRepository.findOne({ where: { boardId } });
    if (!board) {
      throw new NotFoundException('해당 보드는 존재하지 않습니다');
    }

    // 해당 boardId를 가진 리스트들 중 가장 높은 position 값을 찾음
    const highestPosition = await this.listRepository.findOne({
      where: { boardId: board.boardId },
      order: { position: 'DESC' },
    });

    // 새로운 리스트의 position 값 설정
    const newPosition = highestPosition ? highestPosition.position + 1 : 1;

    // Board가 존재하면 새 List를 생성하고 저장
    const list = this.listRepository.create({
      ...createListDto,
      boardId: board.boardId, // Board.entity를 직접 할당
      // board, // board 객체를 직접 할당
      position: newPosition,
    });

    return await this.listRepository.save(list);
  }

  async update(id: number, updateListDto: UpdateListDto) {
    const listToUpdate = await this.listRepository.findOne({ where: { listId: id } });
    if (!listToUpdate) {
      throw new NotFoundException('해당 리스트는 존재하지 않습니다');
    }

    // 컬럼 수정 시 title 이 빈 문자열 이라면 기존의 title 을 유지함
    if (updateListDto.title !== undefined && updateListDto.title.trim() === '') {
      updateListDto.title = listToUpdate.title;
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
      throw new NotFoundException('해당 리스트는 존재하지 않습니다');
    }

    await this.listRepository.softRemove(listToRemove); // remove 메소드 사용하여 찾은 해당 컬럼 삭제
    return { message: '컬럼 제거 성공' };
  }

  async move(listId: number, newBoardId: number, moveListDto: MoveListDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const list = await this.listRepository.findOne({ where: { listId } });
      if (!list) {
        throw new NotFoundException('해당 리스트는 존재하지 않습니다.');
      }

      // 리스트가 다른 보드로 이동하는 경우
      if (list.boardId !== newBoardId) {
        // 새 보드에서의 최대 position 값 찾기
        const highestPositionInNewBoard = await this.listRepository.findOne({
          where: { boardId: newBoardId },
          order: { position: 'DESC' },
        });
        const newPositionInNewBoard = highestPositionInNewBoard
          ? highestPositionInNewBoard.position + 1
          : 1;

        // 리스트의 보드와 포지션 업데이트
        await this.listRepository.update(listId, {
          boardId: newBoardId,
          position: newPositionInNewBoard,
        });
      } else {
        // 리스트가 같은 보드 내에서 이동하는 경우
        const targetPosition = moveListDto.newPosition;

        // 리스트의 현재 포지션과 대상 포지션 비교
        if (list.position < targetPosition) {
          // 리스트가 아래로 이동
          await this.updatePositionsDecrease(
            list.position,
            targetPosition,
            list.boardId,
            queryRunner,
          );
        } else {
          // 리스트가 위로 이동
          await this.updatePositionsIncrease(
            list.position,
            targetPosition,
            list.boardId,
            queryRunner,
          );
        }

        // 리스트 포지션 업데이트
        await this.listRepository.update(listId, { position: targetPosition });
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
  updatePositionsIncrease(
    position: number,
    targetPosition: number,
    boardId: number,
    queryRunner: QueryRunner,
  ) {
    throw new Error('Method not implemented.');
  }
  updatePositionsDecrease(
    position: number,
    targetPosition: number,
    boardId: number,
    queryRunner: QueryRunner,
  ) {
    throw new Error('Method not implemented.');
  }
}
