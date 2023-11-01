import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';
import { Errors } from './errors/errors';
import { PaypalModule } from './paypal/paypal.module';
import configuration from './config/configuration';
import { PaypalService } from './paypal/paypal.service';
import { HttpModule } from '@nestjs/axios';
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
  ],
  controllers: [AppController],
  providers: [AppService, Errors, PaypalService],
})
export class AppModule {}
