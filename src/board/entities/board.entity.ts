import { BoardMember } from "src/board_members/entities/board_members.entity"
import { BoardGrade } from "src/common/types/boardGrade.type"
import { Workspace } from "src/workspaces/entities/workspace.entity"
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

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

  @OneToMany(() => BoardMember, (boardMember) => boardMember.boards)
  boardMember: BoardMember[]


  @ManyToOne(() => Workspace, (workspace) => workspace.board, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'workspace_id', referencedColumnName: 'workspaceId' })
  workspace: Workspace
  @Column()
  workspaceId: number

}
