import { IsNotEmpty } from 'class-validator';
import { TransformInt } from '../validators/TransformInt.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsIntPositive } from '../validators/IsIntPositive.validator';

export class IdDto {
  @ApiProperty()
  @IsNotEmpty()
  @TransformInt()
  @IsIntPositive()
  id: number;
}
