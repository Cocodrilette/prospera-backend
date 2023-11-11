import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { CommonService } from 'src/common/common.service';
import {
  UserDocument,
  UserSuccessCreateResponse,
  UserSuccessDeleteResponse,
  ValidRoles,
} from './types/user.types';
import {
  FilteredUserResponse,
  FindMethodOptions,
  RawUser,
} from './types/service.types';
import { CreateClerkUserDto } from './dto/create-clerk-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly commonService: CommonService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const ifAlreadyExists = await this._findOneByEmail(createUserDto.email);
    if (ifAlreadyExists) return new BadRequestException();

    const user = new this.userModel({
      ...createUserDto,
      password: await this.commonService.crypto.hash(createUserDto.password),
      address: createUserDto.address.toLowerCase(),
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

  async createClerkUser(createClerkUserDto: CreateClerkUserDto) {
    const ifAlreadyExists = await this.findOneByEthAddress(
      createClerkUserDto.address,
    );
    if (ifAlreadyExists) return new BadRequestException();

    const userAddress = createClerkUserDto.address
      ? createClerkUserDto.address.toLowerCase()
      : () => {
          throw new BadRequestException('Address is required');
        };

    const user = new this.userModel({
      ...createClerkUserDto,
      address: userAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      role: ValidRoles.USER,
    });

    const result = await this.commonService.unsafeOperations.executeOrCatch<
      User,
      User
    >(
      () => user.save(),
      async (user: User) => {
        this.logger.log('Clerk user created');
        return user;
      },
      (error) => this._onUserCreatedError(error),
    );

    return result;
  }

  async findAll() {
    const users = await this.userModel.find().exec();

    if (!users) return [];
    return users.map((user) =>
      this.filterUserResponse(user as unknown as UserDocument),
    );
  }

  async findOne(id: string) {
    const user = (await this._findOne(id)) as unknown as UserDocument;
    if (!user) return null;
    return this.filterUserResponse(user) || null;
  }

  async findOneByEmail(
    email: string,
    options: FindMethodOptions = { raw: false },
  ) {
    const user = (await this._findOneByEmail(email)) as unknown as UserDocument;
    if (!user) return null;
    return options.raw ? user : this.filterUserResponse(user);
  }

  async findOneByEthAddress(
    ethAddress: string,
    options: FindMethodOptions = { raw: false },
  ): Promise<RawUser | FilteredUserResponse> {
    const user = await this._findOneByEthAddress(
      ethAddress.toLocaleLowerCase(),
    );
    if (!user) return null;
    return options.raw
      ? user
      : this.filterUserResponse(user as unknown as UserDocument);
  }

  async findOneByClerkId(
    clerkId: string,
    options: FindMethodOptions = { raw: false },
  ) {
    const user = await this.userModel.findOne({ clerkId }).exec();

    if (!user) return null;
    return options.raw
      ? user
      : this.filterUserResponse(user as unknown as UserDocument);
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
      user: this.filterUserResponse(user),
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

  filterUserResponse(user: UserDocument) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    };
  }

  async _findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    return user || null;
  }

  async _findOneByEthAddress(ethAddress: string) {
    const user = await this.userModel.findOne({ address: ethAddress }).exec();
    return user || null;
  }

  async _findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    return user || null;
  }
}
