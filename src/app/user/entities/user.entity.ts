import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/base/entities/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AUTH_VERSION_DIV } from '../constants/user.constants';
import { config } from 'src/configs/config.service';
import { Role } from 'src/base/authorization/role/role.enum';
import { ArticleEntity } from 'src/app/article/entities/article.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'avatar.jpg', nullable : true })
  avatar: string;

  @Column({ default: Role.User })
  role: string;

  @ApiHideProperty()
  @Exclude()
  @Column()
  password: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ nullable: true })
  refresh_token?: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ nullable: true, default: 0 })
  uav?: number;

  @OneToMany(() => ArticleEntity, (articles) => articles.user)
  articles: ArticleEntity[];

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
