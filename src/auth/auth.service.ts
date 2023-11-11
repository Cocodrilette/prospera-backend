import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { RawUser } from '../users/types/service.types';
import { CommonService } from '../common/common.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDocument, ValidRoles } from 'src/users/types/user.types';
import { CreateClerkUserDto } from 'src/users/dto/create-clerk-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly commonService: CommonService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = (await this.usersService.findOneByEmail(email, {
      raw: true,
    })) as unknown as User;

    if (user && 'password' in user && user.password) {
      const isPasswordValid = await this._validatePassword(
        password,
        user as RawUser,
      );
      if (!isPasswordValid) return null;
    }

    return user as RawUser;
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

  async register(user: RegisterUserDto) {
    const newUser: CreateUserDto = {
      ...user,
      role: ValidRoles.USER,
      password: await this.commonService.crypto.hash(user.password),
    };

    console.log({ newUser });

    return await this.usersService.create(newUser);
  }

  validateApiKey(apiKey: string): boolean {
    const currentApiKey = process.env.API_KEY;
    return currentApiKey === apiKey;
  }

  async handleUserId(createClerkUserDto: CreateClerkUserDto) {
    const user = await this.usersService.findOneByClerkId(
      createClerkUserDto.clerkId,
    );

    if (!user) {
      const user = this.usersService.createClerkUser(createClerkUserDto);
      return user && this.login(user as unknown as UserDocument);
    } else {
      return this.login(user as unknown as UserDocument);
    }
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
