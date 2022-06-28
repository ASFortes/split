import { Controller, forwardRef, Inject, Post } from '@nestjs/common';
import { CreateBoardService } from 'src/modules/boards/interfaces/services/create.board.service.interface';
import { GetBoardApplication } from 'src/modules/boards/applications/get.board.application';

import * as BoardTypes from '../../boards/interfaces/types';
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
    @Inject(forwardRef(() => BoardTypes.TYPES.services.CreateBoardService))
    private createBoardService: CreateBoardService,
    @Inject(forwardRef(() => BoardTypes.TYPES.applications.GetBoardApplication))
    private getBoardApplication: GetBoardApplication,
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

  @Post('/test3')
  async test3() {
    const boardId = await this.createBoardService.splitBoardByTeam(
      '62b77b7aac788a58b5100017',
      '62b77b7aac788a58b5100015',
      {
        recurrent: false,
        maxVotes: null,
        hideCards: false,
        hideVotes: false,
        anonymously: false,
        maxUsers: 2,
      },
    );

    const boards = await this.getBoardApplication.getBoard(
      boardId,
      '62b77b7aac788a58b5100017',
    );

    console.log(boards);

    return boards;
    // return this.apiSlackService.createChannelsForRetroTeam(retroTeams);
  }
}
