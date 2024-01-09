import { Injectable } from '@nestjs/common';
import { CreateAlramDto } from './dto/create-alram.dto';
import { UpdateAlramDto } from './dto/update-alram.dto';

@Injectable()
export class AlramService {
  create(createAlramDto: CreateAlramDto) {
    return 'This action adds a new alram';
  }

  findAll() {
    return `This action returns all alram`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alram`;
  }

  update(id: number, updateAlramDto: UpdateAlramDto) {
    return `This action updates a #${id} alram`;
  }

  remove(id: number) {
    return `This action removes a #${id} alram`;
  }
}
