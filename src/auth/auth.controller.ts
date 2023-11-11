import {
  Bind,
  Body,
  Controller,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt.guard';
import { Public } from './decorator/public.decorator';
import { RegisterUserDto } from './dto/register-user.dto';
import { CreateClerkUserDto } from 'src/users/dto/create-clerk-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Req() req: any) {
    return this.authService.refreshUser(req.user);
  }

  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('user')
  async handleUserId(@Body() createClerkUserDto: CreateClerkUserDto) {
    return this.authService.handleUserId(createClerkUserDto);
  }
}
