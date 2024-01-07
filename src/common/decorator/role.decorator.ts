import { SetMetadata } from '@nestjs/common';
import { UserGrade } from '../types/userGrade.type';
import { WorkspaceMemberRole } from '../types/work-member-role.type';

export const Roles = (...roles: UserGrade[] | WorkspaceMemberRole[]) => SetMetadata('roles', roles);
