export enum OperationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum OperationType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
}

export type AdvancedPayment = 'no-required' | string; // BigNumber
