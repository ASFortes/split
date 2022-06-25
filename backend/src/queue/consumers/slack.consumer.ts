import { Process, Processor, OnQueueActive } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('slack-queue')
export class SlackConsumer {
  @Process('slack-job')
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
}
