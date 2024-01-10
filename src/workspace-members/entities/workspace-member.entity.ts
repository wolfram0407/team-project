import { IsNotEmpty } from 'class-validator';
import { WorkspaceMemberRole } from 'src/common/types/work-member-role.type';
import { User } from 'src/user/entities/user.entity';
import { Workspace } from 'src/workspaces/entities/workspace.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('workspace_members')
export class WorkspaceMember {
  @PrimaryColumn({ type: 'int' })
  workspaceId: number;

  @PrimaryColumn({ type: 'int' })
  userId: number;

  /**
   * 멤버 롤
   * @example "Member"
   * @requires true
   */
  @IsNotEmpty()
  @Column({
    type: 'enum',
    enum: WorkspaceMemberRole,
    nullable: false,
    default: WorkspaceMemberRole.Member,
  })
  role: WorkspaceMemberRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => User, (user) => user.workspaceMember, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.workspaceMembers)
  @JoinColumn({
    name: 'workspace_id',
    referencedColumnName: 'workspaceId',
  })
  workspace: Workspace;
}
