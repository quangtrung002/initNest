import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Status } from 'src/base/constants/status';
import {
  BadRequestException,
  NotFoundException,
} from 'src/base/exceptions/custom.exception';
import { jwtConstants } from '../constants/jwt.constant';
import { CodeService } from 'src/app/code/services/code.service';
import { CodeType } from 'src/base/constants/code.type';
import { UserEntity } from 'src/app/user/entities/user.entity';
import { MailService } from 'src/base/mail/mail.service';
import { UserService } from './user.service';
import {
  ActiveRegisterDto,
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  SendEmailDto,
  UpdatePasswordDto,
} from '../dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly codeService: CodeService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user: UserEntity = await this.userService.getOneOrNull({ email });
    if (!user) return null;
    const isEqual = user.comparePw(password);

    return isEqual ? user : null;
  }

  private async createPayload(user: UserEntity, refresh: boolean = true) {
    const payload = {
      email: user.email,
      user_id: user.id,
      role: user.role,
      uav: user['uav'],
    };
    const accessToken = await this.jwtService.sign(payload);

    if (refresh) {
      const refreshToken = await this.jwtService.sign(payload, {
        secret: jwtConstants.secret_refresh_token,
        expiresIn: jwtConstants.expiresIn_token,
      });

      user.hashRefreshToken(refreshToken);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: jwtConstants.expiresIn,
        user,
      };
    } else {
      return {
        expires_in: jwtConstants.expiresIn,
        access_token: accessToken,
        user,
      };
    }
  }

  private _loginError(user) {
    let errorMsg = null;
    if (!user) {
      errorMsg = 'Your login account is invalid!';
    } else {
      switch (user.status) {
        case Status.REGISTER_STATUS:
          errorMsg =
            'This account is not activated, please contact the administrator to activate!';
        case Status.DISABLED:
          errorMsg =
            'Sorry. Your account has been locked. Please contact admin to reopen!';
        case Status.DELETED:
          errorMsg =
            'Sorry. Your account has been deleted. Please contact admin to reopen!';
          break;
      }
    }
    return errorMsg;
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user: UserEntity = await this.validateUser(email, password);
    const errorMsg = await this._loginError(user);
    if (errorMsg) throw new BadRequestException(errorMsg);
    user.refreshUav();
    user.save();

    return await this.createPayload(user);
  }

  async register(dto: RegisterDto) {
    return await this.userService.createUser(dto);
  }

  async sendOtp(dto: SendEmailDto) {
    const user = await this.userService.getOneOrNull({ email: dto.email });
    const otp = await this.codeService.createOtp(
      user.id,
      CodeType.REGISTER,
      'trungbindeptrai',
    );
    this.mailService.sendMail(user.email, 'Trung bin', null, 'otp', { otp });

    return true;
  }

  async verifyOtp(dto: ActiveRegisterDto): Promise<any> {
    const { email, otpCode } = dto;

    const user = await this.userService.getOneOrNull({ email });
    if (!user) throw new NotFoundException('User not found');

    const code = await this.codeService.getOneOtp(user.id, CodeType.REGISTER);
    if (!code) throw new NotFoundException('Code not found');

    const isEqual: boolean = code.verifyOtp(otpCode);
    if (!isEqual) throw new BadRequestException('OTP not correct');
    await this.userService.activeUser(user.id);

    return true;
  }

  async refresh(dto: RefreshTokenDto): Promise<any> {
    const { refresh_token } = dto;
    const payload = await this.jwtService.verify(refresh_token, {
      secret: jwtConstants.secret_refresh_token,
    });

    const { email } = payload;
    const user = await this.userService.getUserByRefresh(refresh_token, email);
    if (!user) throw new BadRequestException('Refresh token not correct');
    user.refreshUav(true);

    return await this.createPayload(user, false);
  }

  async logout(payload): Promise<any> {
    const user = await this.userService.getOneOrNull({ email: payload.email });
    user.deleteRefreshToken();

    return true;
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<any> {
    const user = await this.userService.getOneOrNull({ email: dto.email });
    const otp = await this.codeService.createOtp(
      user.id,
      CodeType.FORGOT_PASSWORD,
      'trungbindeptrai',
    );

    this.mailService.sendMail(user.email, 'Trung bin', null, 'otp', { otp });

    return true;
  }

  async recoverPassword(dto: UpdatePasswordDto): Promise<any> {
    const { email, newPassword, otpCode } = dto;
    const user = await this.userService.getOneOrNull({ email });
    if (!user) throw new NotFoundException('Email not found');

    const otp = await this.codeService.getOneOtp(
      user.id,
      CodeType.FORGOT_PASSWORD,
    );
    if (!otp.checkExprirationTime())
      throw new BadRequestException('Otp expriration time');

    user.hashPw(newPassword);
    user.save();

    return true;
  }
}
