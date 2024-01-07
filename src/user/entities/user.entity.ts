import { BoardMember } from "src/board_members/entities/board_members.entity"
import { UserGrade } from "src/common/types/userGrade.type"
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"


@Entity({
  name: "users",
})

export class User
{

  @PrimaryGeneratedColumn()
  userId: number

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string

  @Column({ nullable: false })
  name: string

  @Column({ type: 'enum', enum: UserGrade, default: UserGrade.Free })
  grade: UserGrade

  @Column({ nullable: false, default: "local" })
  signup_type: string

  @CreateDateColumn()
  created_at: Date
  @UpdateDateColumn()
  updated_at: Date
  @DeleteDateColumn()
  deleted_at: Date


  @ManyToOne(() => BoardMember, (boardMember) => boardMember.user)
  boardMember: BoardMember[]


}