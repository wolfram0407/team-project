import { UserGrade } from "src/common/types/userGrade.type"
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

``
@Entity({
  name: "users",
})

export class User
{

  @PrimaryGeneratedColumn()
  user_id: number

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

}