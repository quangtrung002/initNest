import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  //saft của bcrypt
  PASSWORD_SALT = parseInt(process.env.PASSWORD_SALT ?? '10', 10);

  //phân trang
  PAGINATION_LIMIT = 50;
  PAGINATION_PAGE = 1;

  //cấu hình của otplib
  OTP_SECRET = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';
  OTP_OPTION = {
    digits: 6,
    step: 60,
    window: 5,
  };
  OTP_EXPIRATION_TIME = 2;

  //cấu hình của swagger
  SWAGGER = {
    PRODUCT_NAME: 'Swagger UI Trung Bin',
    VERSION: '1.0',
    CONTACT: {
      IG: 'ig: enqiti.11',
      GMAIL: 'mail: chunbin002@gmail.com',
    },
  };

  // DB
  DB_TYPE = (process.env.DB_TYPE ?? 'postgres') as 'postgres' | 'mysql';
  DB_HOST = process.env.DATABASE_HOST ?? 'localhost';
  DB_PORT = parseInt(process.env.DATABASE_PORT ?? '5432', 10);
  DB_USERNAME = process.env.DATABASE_USERNAME ?? 'postgres';
  DB_PASSWORD = process.env.DATABASE_PASSWORD ?? 'Trungbin002@';
  DB_DATABASE = process.env.DATABASE_NAME ?? '';

  // //Email
  EMAIL_USE_TLS = (process.env.EMAIL_USE_TLS ?? 'true').toLowerCase() === 'true';
  EMAIL_HOST = process.env.EMAIL_HOST ?? 'smtp.gmail.com';
  EMAIL_USER = process.env.EMAIL_USER ?? 'trungbina3qo@gmail.com';
  EMAIL_PASSWORD = process.env.EMAIL_PASS ?? 'tclaxmpjzsgpqnbc';
  EMAIL_PORT = parseInt(process.env.EMAIL_PORT ?? '587', 10);
}

export const config = new ConfigService();
