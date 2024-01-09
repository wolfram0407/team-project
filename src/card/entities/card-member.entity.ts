import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Card } from "./card.entity";
import { BoardMember } from "src/board_members/entities/board_members.entity";

@Entity('card_members')
export class CardMember
{
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @ManyToOne((type) => Card, (card) => card.cardMember)
  @JoinColumn()
  card: Card;
  @Column({ unsigned: true })
  card_id: number;

  // @OneToOne((type) => BoardMember, (boardMember)=> boardMember.cardMember, {onDelete: 'CASCADE'})
  // @JoinColumn({name: 'board_member_id'})
  // boardMember: BoardMember;
}