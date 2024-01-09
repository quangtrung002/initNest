import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CommonService } from 'src/base/services/common.service';
import {
  ConflictException,
  CustomException,
} from 'src/base/exceptions/custom.exception';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { Status } from 'src/base/constants/status';
import { IdDto } from 'src/base/dtos/id.dto';
import { HttpStatusCode } from 'axios';
import { config } from 'src/base/configs/config.service';
import { CreateUserDto } from '../dtos/userCreate.dto';

@Injectable()
export class UserService extends CommonService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly repoUser: Repository<UserEntity>,
    private readonly mailerService: MailerService,
  ) {
    super(repoUser);
  }

  protected aliasName: string = 'users';

  protected _selectFields(param: {}): string[] {
    return [
      'users.id',
      'users.username',
      'users.email',
      'users.status',
      'users.role',
      'users.password',
      'users.refresh_token',
      'users.uav',
      'users.createdAt',
      'users.updatedAt',
    ];
  }

  async getUserActice(option: Partial<UserEntity>): Promise<UserEntity> {
    return this.repoUser
      .createQueryBuilder(this.aliasName)
      .where(option)
      .andWhere('users.status = :status', { status: Status.ACTIVE })
      .getOne();
  }

  async getOneOrNull(option: Partial<UserEntity>): Promise<UserEntity | null> {
    return this.repoUser
      .createQueryBuilder(this.aliasName)
      .where(option)
      .getOne();
  }

  async getUserByRefresh(refresh_token, email): Promise<any> {
    const user = await this.getOneOrNull({ email });
    if (!user) return null;
    const isEqual = user.campareRefreshToken(refresh_token);

    return isEqual ? user : null;
  }

  async activeUser(id: number): Promise<void> {
    this.repoUser.update({ id }, { status: Status.ACTIVE });
  }

  async createUser(dto: RegisterDto): Promise<any> {
    const isExist = await this._checkFieldExist(dto.email, 'email', null);
    if (isExist) throw new ConflictException('Email already exists');

    const user = await this.repoUser.create(dto);
    user.hashPw(dto.password);
    user.save();
  }
}
