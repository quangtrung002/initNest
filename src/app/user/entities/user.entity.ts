import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { CodeEntity } from 'src/app/code/entities/code.entity';
import { BaseEntity } from 'src/base/entities/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AUTH_VERSION_DIV } from '../constants/user.constants';
import { config } from 'src/base/configs/config.service';
import { Role } from 'src/base/authorization/role/role.enum';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({
    name: 'username',
    type: 'varchar',
    length: 255,
  })
  username: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    name: 'role',
    type: 'varchar',
    default: Role.User,
  })
  role: string;
  
  @ApiHideProperty()
  @Exclude()
  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
  })
  password: string;

  @ApiHideProperty()
  @Exclude()
  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  refresh_token?: string;

  @ApiHideProperty()
  @Exclude()
  @Column({
    name: 'uav',
    type: 'int',
    nullable: true,
    default: 0,
  })
  uav?: number;

  @OneToMany(() => CodeEntity, (codes) => codes.user)
  codes: CodeEntity[];

  refreshUav(willSave: boolean = false) {
    this.uav = new Date().getTime() % AUTH_VERSION_DIV;
    willSave ? this.save() : 0;
  }

  hashPw(password: string) {
    this.password = bcrypt.hashSync(password, config.PASSWORD_SALT);
    void this.refreshUav();
  }

  comparePw(rawPw: string): boolean {
    const userPw = this.password;
    return bcrypt.compareSync(rawPw, userPw);
  }

  hashRefreshToken(refresh_token: string) {
    this.refresh_token = bcrypt.hashSync(refresh_token, config.PASSWORD_SALT);
    this.save();
  }

  campareRefreshToken(rawToken: string): boolean {
    const refreshToken = this.refresh_token;
    return bcrypt.compareSync(rawToken, refreshToken);
  }

  deleteRefreshToken() {
    this.refresh_token = null;
    void this.refreshUav(true);
  }
}
