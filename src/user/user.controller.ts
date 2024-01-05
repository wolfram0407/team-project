import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { ReqCreateUserDto, ReqLoginDto } from './dto/req.user.dto';


@ApiTags('User')

@Controller('user')
export class UserController
{
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() { email, password, passwordCheck, name, signup_type }: ReqCreateUserDto)
  {
    if (password !== passwordCheck)
      throw new BadRequestException();
    return this.userService.createUser(email, password, name, signup_type);
  }

  @Post('login')
  async login(@Body() { email, password }: ReqLoginDto)
  {
    return this.userService.login(email, password);
  }


}
