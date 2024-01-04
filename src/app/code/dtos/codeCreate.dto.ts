import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;
}
