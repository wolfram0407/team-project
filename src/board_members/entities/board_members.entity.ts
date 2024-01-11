import { Activity } from 'src/activity/entities/activity.entity';
import { Board } from 'src/board/entities/board.entity';
import { CardMember } from 'src/card_members/entities/card-member.entity';
import { BoardGrade } from 'src/common/types/boardGrade.type';
import { BoardMemberRole } from 'src/common/types/boardMember.type';
import { User } from 'src/user/entities/user.entity';
import
{
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  // ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'b_members',
})
export class BoardMember
{
  @PrimaryGeneratedColumn()
  boardMemberId: number;

  @Column({ type: 'enum', enum: BoardMemberRole, default: BoardMemberRole.Member })
  role: BoardMemberRole;

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.boardMember)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column()
  user_id: number;

  @ManyToOne(() => Board, (board) => board.boardMember, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board_id' })
  boards: Board;
  @Column()
  board_id: number;

  @OneToMany((type) => Activity, (activity) => activity.boardMember)
  activity: Activity[];

  @OneToOne((type) => CardMember, (cardMember) => cardMember.boardMember, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_member_id' })
  cardMember: CardMember;
}
