import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { PaypalService } from '../paypal/paypal.service';
import { HttpModule } from '@nestjs/axios';
import { BlockchainService } from '../blockchain/blockchain.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    HttpModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PaypalService, BlockchainService],
})
export class OrdersModule {}
