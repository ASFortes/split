import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    /* BullModule.registerQueue({
      name: 'slack-queue',
      processors: [
        ((job: Job, done: DoneCallback) => {
          console.log(`[${process.pid}] ${JSON.stringify(job.data)}`);
          done(null, 'It works');
        }) as BullQueueProcessor,
      ],
    }), */
    BullModule.registerQueueAsync({
      name: 'slack-queue',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        name: 'slack-queue',
        redis: {
          host: 'localhost',
          port: configService.get('REDIS_PORT') || 6379,
        },
        /* processors: [
          join(__dirname, 'consumers', 'slack.cosnumer.processor.js'),
        ], */
        // redis: 'localhost', // configService.get('REDIS_URL'),
        /*  prefix: 'prefix', 
            defaultJobOptions: {
              removeOnComplete: true,
                removeOnFail: true,
            },
            settings: {
              lockDuration: 300000,
            } */
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SlackProducerService, SlackConsumer],
  exports: [SlackProducerService],
})
export class QueueModule {}
