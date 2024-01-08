import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository, createQueryBuilder } from 'typeorm';
import { BoardMember } from 'src/board_members/entities/board_members.entity';
import { BoardMemberRole } from 'src/common/types/boardMember.type';
import { BoardMembersService } from 'src/board_members/board_members.service';


@Injectable()
export class BoardService
{
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    private boardMembersService: BoardMembersService,
  ) { }
  async create(userId: number, title: string, image_path: string)
  {
    // 유로버전 로직 구현 필요!



    const board = await this.boardRepository.save({
      title,
      image_path
    })
    const boardMember = await this.boardMembersService.create(userId, board.boardId, BoardMemberRole.Admin)

    if (!boardMember || !board)
    {
      //  에러 처리 필요!(커스텀)
      throw NotAcceptableException
    }
    return {
      message: '보드를 생성했습니다!'
    }
  }


  async findAll(userId: number)
  {
    // 멤버로 되어 있는 보드 조회 
    const boards = await this.boardRepository.find({
      relations: {
        boardMember: true,
      },
      where: {
        boardMember: {
          user: { userId }
        }
      }
    })
    return boards;
  }


  async findOne(id: number, userId: number)
  {

    const board = await this.boardRepository
      .createQueryBuilder("boards")
      .leftJoinAndSelect("boards.boardMember", "boardMember")
      .where("boards.board_id = :id", { id })
      .getMany()


    /*
    const board = await this.boardRepository.findOne({

      relations: {
        boardMemberId: true,
      },
      where: {
        boardId: id,
        boardMemberId: {
          user: { userId }3
        }
      }
    })
*/

    return board
  }

}
