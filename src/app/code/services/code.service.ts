import { Injectable } from '@nestjs/common';
import { CodeEntity } from '../entities/code.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodeType } from 'src/base/constants/code.type';
import { Status } from 'src/base/constants/status';
import { authenticator } from 'otplib';
import { ConfigService, config } from 'src/base/configs/config.service';

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(CodeEntity)
    private readonly repoCode: Repository<CodeEntity>,
    private readonly config: ConfigService,
  ) {}

  protected aliasName: string = 'codes';

  async createOtp(
    user_id: number | null,
    type: CodeType,
    secretKey: string,
    minutes: number = config.OTP_EXPIRATION_TIME,
  ): Promise<string> {
    // await this.deleteOtp(user_id, type);

    authenticator.options = {
      ...this.config.OTP_OPTION,
      epoch: Date.now(),
    };
    const secret = this.config.OTP_SECRET + secretKey;
    const otpCode = authenticator.generate(secret);
    await this.repoCode.save({
      user_id,
      otpCode,
      type,
      expriration_time: new Date(new Date().getTime() + minutes * 60 * 1000),
    });

    return otpCode;
  }

  private deleteOtp(user_id: number, type: CodeType) {
    this.repoCode
      .createQueryBuilder('codes')
      .update(CodeEntity)
      .set({ status: Status.DELETED })
      .where('codes.user_id = :user_id AND codes.type = :type', {
        user_id,
        type,
      })
      .execute();
  }

  getOneOtp(user_id: number, type: CodeType): Promise<CodeEntity> {
    return this.repoCode
      .createQueryBuilder(this.aliasName)
      .where('codes.user_id = :user_id AND codes.type = :type', {
        user_id,
        type,
      })
      .orderBy('codes.expriration_time', 'DESC')
      .getOne();
  }
}
