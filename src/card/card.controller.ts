import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CardMembersService } from 'src/card_members/card_members.service';

@ApiTags("Card")
@Controller('cards')
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly cardMembersService: CardMembersService
    ) {}

  /**
   * 카드 생성
   * @param listId 
   * @param createCardDto 
   * @returns 
   */
  @ApiBearerAuth()
  @Post(":listId")
  async create(
    @Param('listId') listId: number,
    @Body() createCardDto: CreateCardDto) {
      const { title } = createCardDto;
      const data = await this.cardService.create(title, listId);
          
      return {
        statusCode: HttpStatus.CREATED,
        message: '카드 생성',
        data,
      }
  }

  /**
   * 카드 멤버 추가
   * @param cardId 
   * @param boardMemberId 
   * @returns 
   */
  @ApiBearerAuth()
  @Post("/card/:cardId/:boardMemberId")
  async addCardMember(@Param("cardId") cardId:number,
    @Param("boardMemberId") boardMemberId:number
  ){
    const data = await this.cardMembersService.addCardMember(cardId, boardMemberId);    

    return {
      statusCode: HttpStatus.CREATED,
      message: '카드 멤버 추가',
      data,
    }
  }

  /**
   * 리스트안에 카드들 조회
   * @param listId 
   * @returns 
   */
  @ApiBearerAuth()
  @Get(':listId')
  async findAll(
    @Param('listId') listId:number
  ) {
    const data = await this.cardService.findAll(listId);    
    return {
      statusCode: HttpStatus.OK,
      message: '카드 조회',
      data,
    }
  }


  /**
   * 카드 조회
   * @param cardId 
   * @returns 
   */
  @ApiBearerAuth()
  @Get('/card/:cardId')
  async findOne(@Param('cardId') cardId: number) {
    const data = await this.cardService.findOne(cardId);
    return {
      statusCode: HttpStatus.OK,
      message: '카드 조회',
      data,
    }
  }

  /**
   * 카드 업데이트
   * @param id 
   * @param updateCardDto 
   * @returns 
   */
  @ApiBearerAuth()
  @Patch(':cardId')
  async update(@Param('cardId') id: number, @Body() updateCardDto: UpdateCardDto) {
    const data = await this.cardService.update(id, updateCardDto);
  
    return {
      statusCode: HttpStatus.OK,
      message: '카드 수정',
      data,
    }
  }

  /**
   * 카드 삭제
   * @param cardId 
   * @returns 
   */
  @ApiBearerAuth()
  @Delete(':cardId')
  async remove(@Param('cardId') id: number) {
    const data = await this.cardService.remove(id);
   
    return {
      statusCode: HttpStatus.OK,
      message: '카드 삭제',
      data,
    }
  }

  @ApiBearerAuth()
  @Delete("/card/:cardMemberId")
  async removeCardMember(@Param("cardMemberid") id:number){
    await this.cardMembersService.removeCardMember(id);

    return {
      statusCode: HttpStatus.OK,
      message: '카드 멤버 제거',
    }
  }
}
