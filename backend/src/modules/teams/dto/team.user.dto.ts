import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { TeamRoles } from '../../../libs/enum/team.roles';

export default class TeamUserDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  user!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(TeamRoles, { each: true })
  role!: string;

  @IsOptional()
  @IsString()
  @IsMongoId()
  team?: string;
}
