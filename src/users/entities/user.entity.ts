import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ValidRoles } from '../types/user.types';

@Schema()
export class User {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ required: true, type: Date })
  updatedAt: Date;

  @Prop({ required: true, type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: String })
  role: ValidRoles;

  @Prop({ type: String })
  clerkId: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Operation' }] })
  operations: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Order' }] })
  orders: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'EthWallet' }] })
  ethWalletId: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
