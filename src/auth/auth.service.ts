import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { RawUser } from '../users/types/service.types';
import { CommonService } from '../common/common.service';
import { UserDocument } from 'src/users/types/user.types';
import { User } from 'src/users/schemas/user.schema';

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

    return user as UserDocument;
  }

  async login(user: UserDocument) {
    const payload = { email: user.email, sub: user.address };

    return {
      accessToken: this.jwtService.sign(payload),
      user: this.usersService.filterUserResponse(user),
    };
  }

  async refreshUser(user: Partial<User>) {
    const payload = { email: user.email, sub: user.address };
    const _user = await this.usersService.findOneByEmail(payload.email);

    return {
      accessToken: this.jwtService.sign(payload),
      user: _user,
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
