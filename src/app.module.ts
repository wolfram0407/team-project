import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleValidationSchema } from './config/env-validation.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './config/database.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ActivityModule } from './activity/activity.module';
import { WorkspaceModule } from './workspaces/workspaces.module';
import { WorkspaceMembersModule } from './workspace-members/workspace-members.module';
import { BoardModule } from './board/board.module';
import { BoardMembersModule } from './board_members/board_members.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    UserModule,
    AuthModule,
    ActivityModule,
    WorkspaceModule,
    WorkspaceMembersModule,
    BoardModule,
    BoardMembersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
