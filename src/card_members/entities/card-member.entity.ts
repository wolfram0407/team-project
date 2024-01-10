import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Card } from '../../card/entities/card.entity';
import { BoardMember } from 'src/board_members/entities/board_members.entity';

@Entity('card_members')
export class CardMember
{
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;

  @ManyToOne((type) => Card, (card) => card.cardMember)
  @JoinColumn()
  card: Card;
  @Column({ unsigned: true })
  card_id: number;

  @OneToOne((type) => BoardMember, (boardMember) => boardMember.cardMember, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_member_id' })
  boardMember: BoardMember;

}