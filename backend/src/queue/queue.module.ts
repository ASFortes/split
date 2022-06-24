import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { SlackProducerService } from './producers/slack.producer.service';
import { SlackConsumer } from './consumers/slack.consumer';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'slack-queue',
    }),
  ],
  providers: [SlackProducerService, SlackConsumer],
  exports: [SlackProducerService],
})
export class QueueModule {}
