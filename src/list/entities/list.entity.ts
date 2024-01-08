import { IsNotEmpty, IsString } from 'class-validator';
import { Card } from 'src/card/entities/card.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  //   ManyToOne,
  //   OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  position: number;

  @OneToMany((type) => Card, (card) => card.list)
  card: Card[];

  //   @ManyToOne((type) => Board, boardId => board.list, {onDelete: 'CASCADE'})
  //   boardId: Board;
}
