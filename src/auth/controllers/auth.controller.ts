import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from '../dtos/login.dto';
import { AuthService } from '../services/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from '../dtos/register.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { UpdatePasswordDto } from '../dtos/update-password.dto';
import { ActiveRegisterDto } from '../dtos/active-register.dto';
import { ApiOperation } from 'src/base/swagger/swagger.decorator';
import { SendEmailDto } from '../dtos/send-email.dto';
import { SkipAuth } from '../decorator/jwt.decorator';

@SkipAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthPublicController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Đăng nhập' })
  async login(@Body() data: LoginDto): Promise<any> {
    return await this.authService.login(data);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Đăng kí tài khoản mới' })
  async register(@Body() data: RegisterDto): Promise<any> {
    return await this.authService.register(data);
  }

  @Post('/verify-otp')
  @ApiOperation({ summary: 'Xác nhận email bằng OTP' })
  async activeRegister(@Body() data: ActiveRegisterDto): Promise<any> {
    return await this.authService.verifyOtp(data);
  }

  @Post('/send-otp')
  @ApiOperation({ summary: 'Gửi mã OTP xác nhận email' })
  async sendOtp(@Body() data: SendEmailDto): Promise<any> {
    return await this.authService.sendOtp(data);
  }

  @Post('/refresh-token')
  @ApiOperation({ summary: 'Lấy lại token' })
  async refresh(@Body() data: RefreshTokenDto): Promise<any> {
    return await this.authService.refresh(data);
  }

  @ApiOperation({ summary: 'Gửi OTP đổi mật khẩu tới email' })
  @Post('/forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordDto): Promise<any> {
    return await this.authService.forgotPassword(data);
  }

  @ApiOperation({ summary: 'Đặt lại mật khẩu bằng mã OTP' })
  @Post('/recover-password')
  async updatePassword(@Body() data: UpdatePasswordDto): Promise<any> {
    return await this.authService.recoverPassword(data);
  }
}

@ApiTags('Auth')
@UseGuards(JwtAuthGuard)
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Lấy thông tin người dùng đang đăng nhập' })
  @ApiBearerAuth()
  async getProfile(@Request() req): Promise<any> {
    return await req.user;
  }

  @Post('auth/logout')
  @ApiOperation({ summary: 'Đăng xuất' })
  async logout(@Request() req): Promise<any> {
    return await this.authService.logout(req.user);
  }
}
