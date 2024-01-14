import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/base/services/common.service';
import { ConflictException } from 'src/base/exceptions/custom.exception';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { Status } from 'src/base/constants/status';
import { config } from 'src/base/configs/config.service';
import { CreateUserDto } from '../dtos/userCreate.dto';

@Injectable()
export class UserService extends CommonService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly repoUser: Repository<UserEntity>,
  ) {
    super(repoUser);
  }

  protected aliasName: string = 'users';

  protected _selectFields(param: {}): string[] {
    return [
      'users.id',
      'users.username',
      'users.email',
      'users.role',
      'users.password',
      'users.refresh_token',
      'users.uav',
      'users.status',
      'users.createdAt',
      'users.updatedAt',
      'users.createdById',
      'users.updatedById',
      'users.deletedById',
    ];
  }

  protected _orderList(
    query: SelectQueryBuilder<UserEntity>,
    params: any,
  ): SelectQueryBuilder<UserEntity> {
    query = query.orderBy(`${this.aliasName}.id`, 'ASC');
    return query;
  }
}
