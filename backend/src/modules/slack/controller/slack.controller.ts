import { Controller, Inject, Post } from '@nestjs/common';

import { SlackProducerService } from '../../../queue/producers/slack.producer.service';
import { RetroTeamSlackDto } from '../dto/retro-teams.slack.dto';
import { TYPES } from '../interfaces/types';
import { ApiSlackService } from '../services/api.slack.service';

@Controller('slack')
export default class SlackController {
  constructor(
    private readonly slackProducerService: SlackProducerService,
    @Inject(TYPES.services.ApiSlackService)
    private apiSlackService: ApiSlackService,
  ) {}

  @Post('/test1')
  async test1() {
    const retroTeams: RetroTeamSlackDto[] = [
      {
        name: 'team-1',
        participants: [
          {
            email: 'mourabraz@hotmail.com',
          },
          {
            email: 'cmourabraz@gmail.com',
          },
        ],
      },
    ];

    return this.apiSlackService.createChannelsForRetroTeam(retroTeams);
  }

  @Post('/test2')
  async test2() {
    const retroTeams: RetroTeamSlackDto[] = [
      {
        name: 'team-1',
        participants: [
          {
            email: 'mourabraz@hotmail.com',
          },
          {
            email: 'cmourabraz@gmail.com',
          },
        ],
      },
    ];

    this.slackProducerService.sendRetroTeamsToQueue(retroTeams);
    // return this.apiSlackService.createChannelsForRetroTeam(retroTeams);
  }
}
