export enum Currency {
  USD = 'USD',
}

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

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
