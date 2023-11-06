import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { CommonService } from '../common/common.service';
import { RawUser } from '../users/types/service.types';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly commonService: CommonService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email, {
      raw: true,
    });

    if (user && 'password' in user && user.password) {
      const isPasswordValid = await this._validatePassword(password, user);
      if (!isPasswordValid) return null;
    }

    return user;
  }

  async login(user: LoginUserDto) {
    console.log({ user });

    const payload = {};
    // { username: user.name, sub: user.address };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  validateApiKey(apiKey: string): boolean {
    const currentApiKey = process.env.API_KEY;
    return currentApiKey === apiKey;
  }

  private async _validatePassword(
    password: string,
    user: RawUser,
  ): Promise<boolean> {
    return await this.commonService.unsafeOperations.executeOrCatch(
      () => this.commonService.crypto.compare(password, user.password),
      (result) => result,
      (_) => false,
    );
  }
}
