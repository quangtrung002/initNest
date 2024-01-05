import { Module } from '@nestjs/common';
import { AuthController, AuthPublicController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constant';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { UserModule } from '../app/user/user.module';
import { CodeModule } from '../app/code/code.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    CodeModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: jwtConstants.expiresIn,
      },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    // JwtRefreshStrategy
    // GoogleStrategy,
    // FacebookStrategy,
  ],
  controllers: [AuthController, AuthPublicController],
  exports: [AuthService],
})
export class AuthModule {}
