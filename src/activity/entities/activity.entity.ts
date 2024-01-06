import { IsString, IsInt } from "class-validator";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "activity",
})
export class Activity {
  @PrimaryGeneratedColumn()
  activityId: number;

  @IsInt()
  @Column("int", { nullable: false })
  userId: number;

  @IsInt()
  @Column("int", { nullable: false })
  cardId: number;

  @IsString()
  @Column("varchar", { nullable: false })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  //   @ManyToOne(() => User)
  //   @JoinColumn({ name: 'userId' })
  //   user: User;

  //   @ManyToOne(() => Card)
  //   @JoinColumn({ name: 'cardId' })
  //   card: Card;
}
