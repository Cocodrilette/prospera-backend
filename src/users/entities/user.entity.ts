import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ValidRoles } from '../types/user.types';
import { Operation } from '../../operations/entities/operation.entity';

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
  operations: Operation[];

  @Prop({ type: String })
  ethWallet: {
    privateKey: string;
    mnemonic: string;
  } | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
