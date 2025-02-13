import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../shared/guards/auth_guard';
import { BaseUserDto } from 'src/user/dto/base_user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: BaseUserDto) {
    return this.authService.SignIn(
      signInDto.Username,
      signInDto.HashedPassword,
    );
  }

  @Post('register')
  signUp(@Body() signUpDto: BaseUserDto) {
    return this.authService.Register(
      signUpDto.Username,
      signUpDto.HashedPassword,
    );
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: Request): Record<number, string> {
    return req['user'] as Record<number, string>;
  }
}
