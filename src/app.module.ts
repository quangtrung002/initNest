import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './app/user/user.module';
import { CodeModule } from './app/code/code.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { MailModule } from './base/mail/mail.module';
import { ArticleModule } from './app/article/article.module';
import { RoleGuard } from './base/authorization/role/role.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './auth/guards/jwt-refresh-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      logging: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    MailModule,
    AuthModule,
    UserModule,
    CodeModule,
    ArticleModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide : APP_GUARD,
      useClass : JwtAuthGuard
    },
    // {
    //   provide : APP_GUARD,
    //   useClass : JwtRefreshAuthGuard
    // },
    {
      provide : APP_GUARD,
      useClass : RoleGuard 
    }
  ],
})
export class AppModule {}
