import { IsDateString, IsNotEmpty } from "class-validator";
import { BoardMember } from "src/board_members/entities/board_members.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CardMember } from "./card-member.entity";
import { List } from "src/list/entities/list.entity";

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn({unsigned: true})
  id: number;

 
  /**
   * 제목 입력
   * @example "카드 작업 진행중"
   */
  @IsNotEmpty({message: "title을 입력해주세요"})
  @Column()
  title: string;

  @Column({nullable: true})
  description?: string;

  @Column({nullable: true})
  notice?:boolean;
  
  @Column({nullable: true})
  label?: string;

  @IsDateString()
  @Column({type: 'date', nullable: true})
  start_date?: Date;
  
  @IsDateString()
  @Column({type: 'date', nullable: true})
  end_date?: Date;

  @Column({nullable: true})
  image_path?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({nullable: true})
  deleted_at?: Date;

  @ManyToOne((type) => List, (list)=> list.card, {onDelete: 'CASCADE'})
  @JoinColumn({name:'list_id'})
  list: List  
  @Column({ unsigned: true })
  listId: number;


  @OneToMany((type) => CardMember, (cardMember) => cardMember.card)
  cardMember: CardMember[]
}
