import { BoardGrade } from "src/common/types/boardGrade.type"
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity({
  name: "boards",
})

export class Board
{
  @PrimaryGeneratedColumn()
  board_id: number

  @Column({ type: 'varchar', nullable: false })
  title: string

  @Column({ type: 'varchar', nullable: false })
  image_path: string

  @Column({ type: 'enum', nullable: false, default: BoardGrade.Public })
  visibility: BoardGrade

  @CreateDateColumn()
  created_at: Date
  @UpdateDateColumn()
  updated_at: Date
  @DeleteDateColumn()
  deleted_at: Date

}
