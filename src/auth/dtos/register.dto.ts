import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EmailUserDto } from 'src/app/user/dtos/email-user.dto';

const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

export class RegisterDto extends EmailUserDto {
  @ApiProperty({ example: 'Trungbin002@' })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  @Matches(regex, {
    message:
      'Minimum password length is 8 characters including uppercase letters, lowercase letters, numbers and special characters',
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(4, 50)
  username: string;
}
