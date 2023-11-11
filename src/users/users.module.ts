import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { CommonService } from 'src/common/common.service';
import { EthWallet, EthWalletSchema } from './entities/ethWallet.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: EthWallet.name, schema: EthWalletSchema },
    ]),
  ],
  providers: [UsersService, CommonService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
