import { IsString, IsInt } from 'class-validator';
import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
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
  activityId: number;

  @IsInt()
  @Column('int', { nullable: false })
  userId: number;

  @IsInt()
  @Column('int', { nullable: false })
  cardId: number;

  @IsString()
  @Column('varchar', { nullable: false })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // @ManyToOne(() => User, (user) => user.activity)
  // @JoinColumn({ name: 'userId' })
  // user: User;
  // @Column()
  // user_id: number;

  // @ManyToOne(() => Card, (card) => card.activity)
  // @JoinColumn({ name: 'cardId' })
  // card: Card;
  // @Column()
  // card_id: number;
}
