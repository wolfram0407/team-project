import { IsString, IsInt } from 'class-validator';
import { Board } from 'src/board/entities/board.entity';
import { BoardMember } from 'src/board_members/entities/board_members.entity';
import { Card } from 'src/card/entities/card.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'activity',
})
export class Activity {
  @PrimaryGeneratedColumn()
  activityId: number;

  @IsInt()
  @Column('int', { nullable: false })
  userId: number;

  @IsInt()
  @Column('int', { nullable: false, unsigned: true })
  cardId: number;

  @IsString()
  @Column('varchar', { nullable: false })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => BoardMember, (boardMember) => boardMember.activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_member_id' })
  boardMember: BoardMember;

  @ManyToOne(() => Card, (card) => card.activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_id' })
  card: Card;
}
