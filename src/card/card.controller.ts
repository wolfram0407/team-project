import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags("Card")
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
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

  @Get()
  findAll() {
    return this.cardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+id, updateCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardService.remove(+id);
  }
}
