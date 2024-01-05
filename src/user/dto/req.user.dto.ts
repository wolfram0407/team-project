


import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

// 회원가입
export class ReqCreateUserDto
{
  @ApiProperty({ required: true, example: 'test@test.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ required: true, example: '1111' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string


  @ApiProperty({ required: true, example: '1111' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  passwordCheck: string

  @ApiProperty({ required: true, example: '최강창민' })
  @IsString()
  @IsNotEmpty()
  name: string


  @ApiProperty({ example: 'local' })
  @IsString()
  @IsOptional()
  signup_type: string

}

// 로그인
export class ReqLoginDto extends PickType(ReqCreateUserDto, ['email', 'password'] as const) { }

// 로그인
export class ReqUpdateUserDto extends OmitType(ReqCreateUserDto, ['email', 'password', 'signup_type'] as const) { }