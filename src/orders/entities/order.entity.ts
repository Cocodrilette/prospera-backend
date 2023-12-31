import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Currency, OrderStatus } from '../../paypal/types/order.types';

@Schema()
export class Order {
  @Prop({ required: true })
  userAddress: string;

  @Prop({ required: true })
  tokensAmount: number;

  @Prop({ required: true })
  currency: Currency;

  @Prop({ required: true })
  tokenPrice: number;

  @Prop({ required: true })
  status: OrderStatus;

  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ required: true, type: Date })
  updatedAt: Date;

  @Prop({ required: true })
  requestId: string;

  @Prop({ default: '' })
  paypalOrderId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
