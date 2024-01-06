import { IsString, IsInt } from 'class-validator';
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
  activity_id: number;

  @IsInt()
  @Column('int', { nullable: false })
  user_id: number;

  @IsInt()
  @Column('int', { nullable: false })
  card_id: number;

  @IsString()
  @Column('varchar', { nullable: false })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  //   @ManyToOne(() => User)
  //   @JoinColumn({ name: 'user_id' })
  //   user: User;

  //   @ManyToOne(() => Card)
  //   @JoinColumn({ name: 'card_id' })
  //   card: Card;
}
