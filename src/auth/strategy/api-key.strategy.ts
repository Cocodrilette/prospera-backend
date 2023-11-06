import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(private readonly authService: AuthService) {
    super(
      {
        header: 'x-api-key',
        prefix: 'Api-Key ',
      },
      true,
      async (apikey: string | undefined, done: any) => {
        const isValid = this.authService.validateApiKey(apikey);
        done(null, isValid);
      },
    );
  }

  validate(apiKey: string): boolean {
    return this.authService.validateApiKey(apiKey);
  }
}
