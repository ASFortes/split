import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';
import DatabaseModule from './infrastructure/database/database.module';
import UsersModule from './modules/users/users.module';
import AuthModule from './modules/auth/auth.module';
import BoardsModule from './modules/boards/boards.module';
import SocketModule from './modules/socket/socket.module';
import { CardsModule } from './modules/cards/cards.module';
import { CommentsModule } from './modules/comments/comments.module';
import AppConfigModule from './infrastructure/config/config.module';
import { VotesModule } from './modules/votes/votes.module';
import { configuration } from './infrastructure/config/configuration';
import { SchedulesModule } from './modules/schedules/schedules.module';
import AzureModule from './modules/azure/azure.module';
import TeamsModule from './modules/teams/teams.module';

const imports = [
  AppConfigModule,
  DatabaseModule,
  UsersModule,
  AuthModule,
  BoardsModule,
  SocketModule,
  CardsModule,
  CommentsModule,
  VotesModule,
  TeamsModule,
  ScheduleModule.forRoot(),
  SchedulesModule,
];

if (configuration().azure.enabled) {
  imports.push(AzureModule);
}

@Module({
  imports,
  controllers: [],
  providers: [],
})
export default class AppModule {}
