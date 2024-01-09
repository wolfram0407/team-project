import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  // Param,
  Delete,
  BadRequestException,
  // UseGuards,
  // Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReqCreateUserDto, ReqLoginDto, ReqUpdateUserDto } from './dto/req.user.dto';
import { UserInfo } from 'src/common/decorator/user.decorator';
import { User } from './entities/user.entity';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  create(@Body() { email, password, passwordCheck, name, signup_type }: ReqCreateUserDto) {
    if (password !== passwordCheck) throw new BadRequestException();
    return this.userService.createUser(email, password, name, signup_type);
  }


  @Public()
  @Post('login')
  async login(@Body() { email, password }: ReqLoginDto) {
    return this.userService.login(email, password);
  }

  @ApiBearerAuth()
  @Get('mypage')
  async getUserInfo(@UserInfo() user: User) {
    return user;
  }

  @ApiBearerAuth()
  @Patch('mypage')
  async updateUserInfo(@UserInfo() user: User, @Body() { name }: ReqUpdateUserDto) {
    return this.userService.updateUserInfo(user.userId, name);
  }

  @ApiBearerAuth()
  @Delete('/delete')
  async deleteUser(@UserInfo() user: User) {
    return this.userService.deleteUser(user.userId);
  }
}
