import {
  IsString,
  IsNotEmpty,
  ArrayNotEmpty,
  ArrayMinSize,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import ColumnDto from './column.dto';
import UserDto from '../../users/dto/user.dto';

export default class BoardDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  title: string;

  @ArrayNotEmpty()
  @ArrayMinSize(3)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ColumnDto)
  columns: ColumnDto[];

  @IsNotEmpty()
  locked: boolean;

  @IsNotEmpty()
  createdBy: UserDto;

  @IsOptional()
  password: string;
}
