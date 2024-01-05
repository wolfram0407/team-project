import { SetMetadata } from "@nestjs/common";
import { UserGrade } from "../types/userGrade.type";



export const Roles = (...roles: UserGrade[]) => SetMetadata('roles', roles);