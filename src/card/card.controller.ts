import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags("Card")
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

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
}
