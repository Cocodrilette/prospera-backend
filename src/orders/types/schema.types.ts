import { Currency, OrderStatus } from '../../paypal/types/order.types';

export type MockedSchema = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  userAddress: string;
  currency: Currency;
  status: OrderStatus;
  tokenPrice: number;
  tokensAmount: number;
  price: number;
};
