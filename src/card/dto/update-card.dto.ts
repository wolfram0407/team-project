import { IsBoolean, IsDate, IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateCardDto {
  /**
   * 설명
   * @example "카드 설명 입니다."
   */
  @IsOptional()
  @IsString()
  description?: string;
  
  /**
   * 알림 설정
   * @example "true"
   */
  @IsOptional()
  @IsBoolean()
  notice?:boolean;
  
  /**
   * 라벨 테스트 근데 테이블 따로 빼야될듯?
   * @example "확인 요청"
   */
  @IsOptional()
  @IsString()
  label?: string;
  
  /**
   * 시작일
   * @example "2024-01-19"
   */
  @IsOptional()
  @IsDateString()
  start_date?: Date;
  
  /**
   * 종료일
   * @example "2024-01-20"
   */
  @IsOptional()
  @IsDateString()
  end_date?: Date;
  
  /**
   * 이미지 주소
   * @example https://image.news1.kr/system/photos/2023/12/23/6394223/article.jpg/dims/optimize
  */
   
  @IsOptional()
  @IsString()
  image_path?: string;
}
