import { IsNotEmpty, IsString } from 'class-validator';
import { Card } from 'src/card/entities/card.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Board } from 'src/board/entities/board.entity';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn({ unsigned: true })
  listId: number;

  /**
   * 컬럼 생성
   * @example "제목 example"
   */
  @IsNotEmpty({ message: '제목을 입력해주세요' })
  @IsString()
  @Column()
  title: string;

  // /**
  //  * 컬럼 생성
  //  * @example "내용 example"
  //  */
  // @IsNotEmpty({ message: '내용을 입력해주세요' })
  // @IsString()
  // @Column()
  // content: string;

  // /**
  //  * 상태 표시
  //  * @example "Backlog"
  //  */
  // @IsEnum(ListStatus)
  // @Column({ type: 'enum', enum: ListStatus, default: ListStatus.Backlog })
  // status: ListStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // @Generated('increment')
  @Column({ nullable: true })
  position?: number;

  @OneToMany(() => Card, (card) => card.id)
  card: Card[];

  @ManyToOne(() => Board, (board) => board.listId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @Column({})
  boardId: number;
}
