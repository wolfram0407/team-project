import { IsNotEmpty } from 'class-validator';
import { WorkspaceMemberRole } from 'src/common/types/work-member-role.type';
import { User } from 'src/user/entities/user.entity';
import { Workspace } from 'src/workspaces/entities/workspace.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
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

  @ManyToOne(() => User, (user) => user.workspaceMembers, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.workspaceMembers, { onDelete: 'CASCADE' })
  workspace: Workspace;
}
