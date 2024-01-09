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
  @Column('int', { nullable: false })
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

  @ManyToOne(() => BoardMember, (boardMember) => boardMember.activity)
  @JoinColumn({ name: 'boardMemberId' })
  boardMember: BoardMember;
  @Column()
  boardMember_id: number;

  @ManyToOne(() => Card, (card) => card.activity)
  @JoinColumn({ name: 'cardId' })
  card: Card;
  @Column()
  card_id: number;
}
