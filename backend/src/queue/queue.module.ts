import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import { SlackProducerService } from './producers/slack.producer.service';
import { SlackConsumer } from './consumers/slack.consumer';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: SlackProducerService.QUEUE_NAME,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        name: SlackProducerService.QUEUE_NAME,
        redis: {
          username: configService.get('redis.user'),
          password: configService.get('redis.password'),
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        },
        /* processors: [
          join(__dirname, 'consumers', 'slack.cosnumer.processor.js'),
        ], */
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SlackProducerService, SlackConsumer],
  exports: [SlackProducerService],
})
export class QueueModule {}
