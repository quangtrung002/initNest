import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(4, 50)
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({ allow_display_name: true })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
