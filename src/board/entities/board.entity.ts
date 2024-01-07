import { BoardMember } from "src/board_members/entities/board_members.entity"
import { BoardGrade } from "src/common/types/boardGrade.type"
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity({
  name: "boards",
})

export class Board
{
  @PrimaryGeneratedColumn()
  boardId: number

  @Column({ type: 'varchar', nullable: false })
  title: string

  @Column({ type: 'varchar', nullable: false })
  image_path: string

  @Column({ type: 'enum', enum: BoardGrade, default: BoardGrade.Public })
  visibility: BoardGrade


  @CreateDateColumn()
  created_at: Date
  @UpdateDateColumn()
  updated_at: Date
  @DeleteDateColumn()
  deleted_at: Date

  @OneToMany(() => BoardMember, (boardMember) => boardMember.board)
  boardMemberId: BoardMember[]
}
