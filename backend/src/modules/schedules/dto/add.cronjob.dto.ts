import { Configs } from '../../boards/interfaces/services/create.board.service.interface';

export class AddCronJobDto {
  boardId!: string;

  ownerId!: string;

  teamId!: string;

  configs!: Configs;
}
