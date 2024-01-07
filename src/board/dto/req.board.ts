import { ApiProperty, PartialType } from "@nestjs/swagger"
import { IsOptional, IsString, MinLength } from "class-validator"



export class CreateBoardDto
{

  board_id: number

  @ApiProperty({ required: true, example: 'test보드' })
  @IsString()
  @MinLength(20)
  title: string

  @ApiProperty({ example: 'cp872722/2022/12/202212008462_500.jpg' })
  @IsOptional()
  @IsString()
  image_path: string


}


export class UpdateBoardDto extends PartialType(CreateBoardDto) { }