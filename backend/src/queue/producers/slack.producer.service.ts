import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { RetroTeamSlackDto } from 'src/modules/slack/dto/retro-teams.slack.dto';

@Injectable()
export class SlackProducerService {
  public static readonly QUEUE_NAME = 'slack-queue';

  public static readonly SEND_RETRO_TEAMS_TO_QUEUE_JOB =
    'slack-send-retro-treams-to-queue-job';

  constructor(
    @InjectQueue(SlackProducerService.QUEUE_NAME) private queue: Queue,
  ) {}

  // Job Options https://docs.nestjs.com/techniques/queues#job-options
  async sendRetroTeamsToQueue(_retroTeams: RetroTeamSlackDto[]) {
    await this.queue.add(
      SlackProducerService.SEND_RETRO_TEAMS_TO_QUEUE_JOB,
      _retroTeams,
    );
  }
}
