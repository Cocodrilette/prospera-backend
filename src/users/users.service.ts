import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { CommonService } from 'src/common/common.service';
import {
  UserDocument,
  UserSuccessCreateResponse,
  UserSuccessDeleteResponse,
} from './types/user.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly commonService: CommonService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel({
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    });

    const result = await this.commonService.unsafeOperations.executeOrCatch<
      UserSuccessCreateResponse,
      User
    >(
      () => user.save(),
      (user: UserDocument) => this._onUserCreated(user),
      (error) => this._onUserCreatedError(error),
    );

    return result;
  }

  async findAll() {
    const users = await this.userModel.find().exec();

    if (!users) return [];
    return users.map((user) => this._filterUserResponse(user));
  }

  async findOne(id: string) {
    const user = await this._findOne(id);

    if (!user) return null;
    return this._filterUserResponse(user);
  }

  async update(id: string, updateUserDto: any) {
    const currentUser = await this.findOne(id);

    if (!currentUser) return `User with id ${id} not found`;

    const user = {
      ...updateUserDto,
      updatedAt: new Date(),
    };

    const onSuccessMessage = 'User updated successfully';
    const result = await this.commonService.unsafeOperations.executeOrCatch<
      UserSuccessCreateResponse,
      User
    >(
      () =>
        this.userModel
          .findByIdAndUpdate(id, user, { returnDocument: 'after' })
          .exec(),
      (user: UserDocument) => this._onUserCreated(user, onSuccessMessage),
      (error) => this._onUserCreatedError(error),
    );

    return result;
  }

  async remove(id: string) {
    const currentUser = await this._findOne(id);

    if (!currentUser) return `User with id ${id} not found`;

    const result = await this.commonService.unsafeOperations.executeOrCatch<
      UserSuccessDeleteResponse,
      User
    >(
      () => this.userModel.findByIdAndDelete(id).exec(),
      (user: UserDocument) => this._onUserDeleted(user),
      (error) => this._onUserCreatedError(error),
    );

    return result;
  }

  async _onUserCreated(
    user: UserDocument,
    customMessage?: string,
  ): Promise<UserSuccessCreateResponse> {
    return {
      message: customMessage ?? 'User created successfully',
      success: true,
      user: this._filterUserResponse(user),
    };
  }

  async _onUserCreatedError(error: any) {
    const response = {
      message: error.message,
    };

    throw new InternalServerErrorException(response);
  }

  async _onUserDeleted(user: UserDocument): Promise<UserSuccessDeleteResponse> {
    return {
      message: 'User deleted successfully',
      success: true,
      user: {
        id: user._id,
      },
    };
  }

  private _filterUserResponse(user: UserDocument) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
    };
  }

  async _findOne(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (!user) return null;
    return user;
  }
}