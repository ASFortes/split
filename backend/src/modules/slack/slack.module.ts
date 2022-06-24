import { Module } from '@nestjs/common';
import { QueueModule } from 'src/queue/queue.module';

import SlackController from './controller/slack.controller';
import {
  apiSlackService,
  chatSlackService,
  conversationsSlackService,
  usersSlackService,
  webApiSlackService,
} from './slack.providers';

@Module({
  imports: [QueueModule],
  providers: [
    webApiSlackService,
    usersSlackService,
    conversationsSlackService,
    chatSlackService,
    apiSlackService,
  ],
  controllers: [SlackController],
  exports: [apiSlackService],
})
export class SlackModule {}
