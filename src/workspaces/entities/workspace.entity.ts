import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Board } from 'src/board/entities/board.entity';
import { User } from 'src/user/entities/user.entity';
import { WorkspaceMember } from 'src/workspace-members/entities/workspace-member.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'workspaces' })
export class Workspace {
  @PrimaryGeneratedColumn()
  workspaceId: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  /**
   * 타이틀
   * @example "Workspace1"
   * @requires true
   */
  @IsString()
  @IsNotEmpty({ message: '워크스페이스 제목을 입력해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  title: string;

  /**
   * 워크스페이스 설명
   * @example "This is Workspace of 기탄신기"
   * @requires false
   */
  @IsString()
  @IsOptional()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.workspaces, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany((type) => WorkspaceMember, (workspaceMember) => workspaceMember.workspace, {
    cascade: ['soft-remove'],
  })
  workspaceMembers: WorkspaceMember[];

  @OneToMany(() => Board, (board) => board.workspace, { cascade: ['soft-remove'] })
  board: Board[];
}
