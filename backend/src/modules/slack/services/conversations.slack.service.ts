import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SLACK_CHANNEL_PREFIX } from '../../../libs/constants/slack';
import { CreateChannelDto } from '../dto/create.channel.slack.dto';
import { ConversationsSlackServiceInterface } from '../interfaces/services/conversations.slack.service';
import { WebApiSlackServiceInterface } from '../interfaces/services/webapi.slack.service';
import { TYPES } from '../interfaces/types';

@Injectable()
export class ConversationsSlackService
  implements ConversationsSlackServiceInterface
{
  private logger = new Logger(ConversationsSlackService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(TYPES.services.WebApiSlackService)
    private readonly webApiSlackService: WebApiSlackServiceInterface,
  ) {}

  async createChannel(
    createChannelDto: CreateChannelDto,
  ): Promise<{ name: string; id: string }> {
    try {
      const today = new Date();

      // https://api.slack.com/methods/admin.conversations.create
      const { channel } = await this.webApiSlackService
        .getClient()
        .conversations.create({
          name: `${this.configService.get(SLACK_CHANNEL_PREFIX)}${
            createChannelDto.name
          }-${today.getMonth() + 1}-${today.getFullYear()}`,
        });

      return {
        id: channel?.id || '',
        name: channel?.name || '',
      };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async inviteUsersToChannel(
    channelId: string,
    usersIds: string[],
  ): Promise<{ ok: boolean; channelId: string }> {
    try {
      // https://api.slack.com/methods/admin.conversations.invite
      const { ok } = await this.webApiSlackService
        .getClient()
        .conversations.invite({
          channel: channelId,
          users: usersIds.join(','),
        });

      return { ok, channelId };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async fetchMembersFromChannelSlowly(channelId: string): Promise<string[]> {
    try {
      let cursor;
      const channelMembers: string[] = [];

      do {
        // https://api.slack.com/methods/conversations.members
        const result =
          // eslint-disable-next-line no-await-in-loop
          await this.webApiSlackService.getClient().conversations.members({
            channel: channelId,
            cursor,
          });

        channelMembers.push(...(result.members ?? []));
        cursor = result.response_metadata?.next_cursor;
      } while (cursor);

      return channelMembers;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}