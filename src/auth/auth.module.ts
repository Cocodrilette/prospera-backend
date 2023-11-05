import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { authConstants } from './constants';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { CommonModule } from '../common/common.module';
import { LocalStrategy } from './strategy/local.strategy';
import { ApiKeyStrategy } from './strategy/api-key.strategy';

@Module({
  imports: [
    UsersModule,
    CommonModule,
    PassportModule,
    JwtModule.register(authConstants.jwt),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, ApiKeyStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
