import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueError,
  OnQueueFailed,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { SlackProducerService } from '../producers/slack.producer.service';

@Processor(SlackProducerService.QUEUE_NAME)
export class SlackConsumer {
  private logger = new Logger(SlackConsumer.name);

  @Process(SlackProducerService.SEND_RETRO_TEAMS_TO_QUEUE_JOB)
  consumeRetroTeamsFromQueue(job: Job<unknown>) {
    console.log(job.data);
    return { message: 'done' };
  }

  // others built-in https://docs.nestjs.com/techniques/queues#event-listeners
  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    console.log(
      `Completed job ${job.id} of type ${job.name} with result ${JSON.stringify(
        result,
      )}.`,
    );
  }

  @OnQueueError()
  onError(error: Error) {
    this.logger.error(error.message);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`${job.name} fail: ${error.message}`);
  }
}
