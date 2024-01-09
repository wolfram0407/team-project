import { IsString, IsInt } from 'class-validator';
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
  name: 'alram',
})
export class Alram {
  @PrimaryGeneratedColumn()
  alramId: number;

  @Column()
  message: string;

  @IsInt()
  @Column('int', { nullable: false })
  userId: number;

  @IsString()
  @Column('varchar', { nullable: false })
  content: string;
  //   @ManyToOne(() => User, (user) => user.alram, { onDelete: 'CASCADE' })
  //   @JoinColumn({ name: 'user_id' })
  //   user: User;
}
