import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { Errors } from './errors/errors';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import configuration from './config/configuration';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { OrdersModule } from './orders/orders.module';
import { PaypalModule } from './paypal/paypal.module';
import { PaypalService } from './paypal/paypal.service';
import { ApiKeyGuard } from './auth/guard/api-key.guard';
import { BlockchainModule } from './blockchain/blockchain.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      dbName: process.env.NODE_ENV || 'test',
    }),
    HttpModule,
    OrdersModule,
    PaypalModule,
    BlockchainModule,
    AuthModule,
    UsersModule,
    CommonModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Errors,
    PaypalService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
