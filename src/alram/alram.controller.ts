import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlramService } from './alram.service';
import { CreateAlramDto } from './dto/create-alram.dto';
import { UpdateAlramDto } from './dto/update-alram.dto';

@Controller('alram')
export class AlramController {
  constructor(private readonly alramService: AlramService) {}

  @Post()
  create(@Body() createAlramDto: CreateAlramDto) {
    return this.alramService.create(createAlramDto);
  }

  @Get()
  findAll() {
    return this.alramService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alramService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlramDto: UpdateAlramDto) {
    return this.alramService.update(+id, updateAlramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alramService.remove(+id);
  }
}
