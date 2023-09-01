import { Model } from 'mongoose';
import { Currency, MockedSchema, OrderStatus } from '../../types/schema.types';

export const orderModel: Model<MockedSchema> = {
  getById: (id: string): MockedSchema => {
    return {
      _id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      userAddress: '0x3Bd208F4bC181439b0a6aF00C414110b5F9d2656',
      currency: Currency.USD,
      status: OrderStatus.PENDING,
      tokenPrice: 100,
      tokensAmount: 100,
      price: 100,
    };
  },
} as any;
