import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MoveListDto } from './dto/move-list.dto';
import { List } from './entities/list.entity';
import { CreateListDto, UpdateListDto } from './dto/req-list.dto';
import { Board } from 'src/board/entities/board.entity';

@Injectable()
export class ListService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    // private connection: Connection,
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


   
  async findOne(id: number) {
    const list = await this.listRepository.findOne({where: {listId: id}})
    
    return list;
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

  async moveList(listId: number, board_id: number, moveListDto: MoveListDto) {
    const { position } = moveListDto;

    const list = await this.listRepository.findOne({
      where: { listId },
    });
    // 없는 list 이동 방지하려고 넣어두신건가?
    if (!list) {
      throw new NotFoundException('리스트가 존재하지 않습니다');
    }
    console.log('#$#$#$#@#!$#$#%#@$', list);

    const lastestList = await this.listRepository.maximum('position', { boardId: board_id });

    // 리스트를 뒤로 이동할때
    // 동일한 보드 내에서 이동할 경우

    if (board_id === list.boardId) {
      if (lastestList < position) {
        throw new BadRequestException('최대 포지션 값을 넘을 수 없습니다.');
      } else if (position < 1) {
        throw new BadRequestException('포지션 값은 1보다 작을 수 없습니다');
      }

      if (list.position < position) {
        await this.dataSource
          .createQueryBuilder()
          .update(List)
          .set({
            position: () => 'position - 1',
          })
          .where(`position <=${position} && position > ${list.position} && board_id = ${board_id}`)
          .execute();

        const updatedList = await this.dataSource
          .createQueryBuilder()
          .update(List)
          .set({
            boardId: board_id,
            position,
          })
          .where(`list_id= ${listId}`)
          .execute();

        return updatedList;
      } else if (list.position > position) {
        await this.dataSource
          .createQueryBuilder()
          .update(List)
          .set({
            position: () => 'position + 1',
          })
          .where(`position >=${position} && position < ${list.position} && board_id = ${board_id}`)
          .execute();

        const updatedList = await this.dataSource
          .createQueryBuilder()
          .update(List)
          .set({ boardId: board_id, position })
          .where(`list_id= ${listId}`)
          .execute();

        return updatedList;
      }
    } else if (board_id !== list.boardId) {
      // 다른 보드로 이동하려는 경우

      if (position > lastestList + 1 || position < 1) {
        throw new BadRequestException('올바르지 않는 위치 값 입니다');
      }

      await this.dataSource
        .createQueryBuilder()
        .update(List)
        .set({
          position: () => 'position + 1',
        })
        .where(`position >= ${position} && board_id = ${board_id}`)
        .execute();

      // move 하려는 list의 position 값 기준 높은 position 값 가지고 있는 list들의 position -1
      console.log(list.boardId);
      await this.dataSource
        .createQueryBuilder()
        .update(List)
        .set({
          position: () => 'position - 1',
        })
        .where(`position > ${list.position} && board_id = ${list.boardId}`)
        .execute();

      const updatedList = await this.dataSource
        .createQueryBuilder()
        .update(List)
        .set({ boardId: board_id, position })
        .where(`list_id= ${listId}`)
        .execute();

      return updatedList;
    }
  }
}
