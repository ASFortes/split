import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebClient } from '@slack/web-api';
import { Profile as ProfileWebApi } from '@slack/web-api/dist/response/UsersProfileGetResponse';

import { SLACK_API_BOT_TOKEN } from '../../../libs/constants/slack';
import { WebApiSlackServiceInterface } from '../interfaces/services/webapi.slack.service';

@Injectable()
export class WebApiSlackService implements WebApiSlackServiceInterface {
  private logger = new Logger(WebApiSlackService.name);

  private client: WebClient;

  constructor(private readonly configService: ConfigService) {
    this.client = new WebClient(this.configService.get(SLACK_API_BOT_TOKEN));

    this.logger.verbose('Slack web api client created');
  }

  public getClient(): WebClient {
    return this.client;
  }
}

export type Profile = ProfileWebApi & { userId: string };