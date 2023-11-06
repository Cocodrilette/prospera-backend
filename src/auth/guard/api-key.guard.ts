import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';

@Injectable()
export class ApiKeyGuard extends AuthGuard('headerapikey') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    else return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, apiKey: any): TUser {
    if (err || !apiKey) {
      throw err || new UnauthorizedException();
    }
    return apiKey;
  }
}
