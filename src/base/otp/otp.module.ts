import { Module } from '@nestjs/common';
import { OtpService } from 'src/base/otp/services/otp.service';
import { ConfigService } from 'src/base/configs/config.service';

@Module({
  providers: [OtpService, ConfigService],
  exports: [OtpService],
})
export class CodeModule {}
