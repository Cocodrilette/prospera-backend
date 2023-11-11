import { ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  AdvancedPayment,
  OperationStatus,
  OperationType,
} from '../types/operation.types';

@Schema()
export class Operation {
  @Prop({ required: true })
  userId: ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ required: true })
  status: OperationStatus;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  type: OperationType;

  @Prop({ required: true })
  details: {
    endDateTime: Date;
    startDateTime: Date;
    location: string;
    /**
     * If the operation is a purchase, this field will be the requested amount of tokens or '0'.
     * If the operation is a sale, this field will be 'no-required'.
     */
    advancePayment: AdvancedPayment; // BigNumber
    totalContractvalue: string; // BigNumber
    productCode: string;
    productDescription: string;
    productQuantity: number;
    productUnitPrice: string; // BigNumber
  };
}

export const OperationSchema = SchemaFactory.createForClass(Operation);
