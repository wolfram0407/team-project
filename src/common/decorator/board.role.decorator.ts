import { SetMetadata } from '@nestjs/common';


import { BoardMemberRole } from '../types/boardMember.type';

export const B_Roles = (...b_roles: BoardMemberRole[]) => SetMetadata('b_roles', b_roles);
