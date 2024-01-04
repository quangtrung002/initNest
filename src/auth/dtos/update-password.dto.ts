import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { EmailUserDto } from 'src/app/user/dtos/email-user.dto';

const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

export class UpdatePasswordDto extends EmailUserDto {
  @ApiProperty({ example: 'Trungbin002@' })
  @Matches(regex, {
    message:
      'Minimum password length is 8 characters including uppercase letters, lowercase letters, numbers and special characters',
  })
  newPassword: string;

  @ApiProperty({ example: '000000' })
  @IsNotEmpty()
  otpCode: string;
}
