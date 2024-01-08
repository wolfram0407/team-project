import { Board } from 'src/board/entities/board.entity';
import { HttpStatus, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, } from 'typeorm';
import { BoardMember } from 'src/board_members/entities/board_members.entity';
import { BoardMemberRole } from 'src/common/types/boardMember.type';
import { BoardMembersService } from 'src/board_members/board_members.service';
import { BoardGrade } from 'src/common/types/boardGrade.type';


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


    return board
  }


  async searchBoard(search: string)
  {
    const board = await this.boardRepository
      .createQueryBuilder("boards")
      .where("boards.title like :search", { search: `%${search}%` })
      .getMany()


    return board
  }

  async updateBoard(id: number, title: string, image_path: string)
  {
    const board = await this.boardRepository.findOne({
      where: { boardId: id },
    })
    if (!board)
    {
      throw new NotFoundException()
    }

    const updateBoard = await this.boardRepository.update({ boardId: id, }, {
      title,
      image_path,
    })
    if (!updateBoard)
    {
      // 디비 에러 처리 필요!
      throw new NotFoundException()
    }
    return {
      message: 'Board updated successfully'
    }

  }


  async deleteBoard(id: number, userId: number)
  {
    const board = await this.boardRepository
      .createQueryBuilder("boards")
      .leftJoinAndSelect("boards.boardMember", "boardMember")
      .where("boards.boardId = :id", { id })
      .getOne()

    if (!board)
    {
      throw new NotFoundException()
    }

    if (board.boardMember[0].role == BoardMemberRole.Admin)
    {
      //보드 삭제
      const deleteBoard = await this.boardRepository.softDelete({
        boardId: id
      })
      if (!deleteBoard)
      {
        // 디비 에러 처리 필요!
        throw new NotFoundException()
      }
      return {
        message: 'Board deleted successfully'
      }
    }

    // 보드 떠나기(테스트 필요)
    return await this.boardMembersService.deleteMember(id, userId)
  }




}
