import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { RetroTeamSlackDto } from 'src/modules/slack/dto/retro-teams.slack.dto';

@Injectable()
export class SlackProducerService {
  constructor(@InjectQueue('slack-queue') private queue: Queue) {}

  // Job Options https://docs.nestjs.com/techniques/queues#job-options
  async sendRetroTeamsToQueue(_retroTeams: RetroTeamSlackDto[]) {
    await this.queue.add('slack-job', _retroTeams);
  }
}
