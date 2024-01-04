import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

export class LoginDto {
  @ApiProperty({ example: 'admin@gmail.com' })
  @IsNotEmpty()
  @IsEmail({ allow_display_name: true })
  email: string;

  @ApiProperty({ example: 'Trungbin002@' })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  @Matches(regex, {
    message:
      'Minimum password length is 8 characters including uppercase letters, lowercase letters, numbers and special characters',
  })
  password: string;
}
