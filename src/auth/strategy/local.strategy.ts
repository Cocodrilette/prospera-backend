import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'address',
      passwordField: 'password',
    });
  }

  async validate(address: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(address, password);

    if (!user) throw new UnauthorizedException();
    return user;
  }
}
