import { Document } from 'mongoose';
import { SuccessResponse } from '../../common/types/success.types';
import { User } from '../schemas/user.schema';

export interface UserDocument extends Document {
  address: string;
  name: string;
  email: string;
  age: number;
  password: string;
  role: ValidRoles;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSuccessCreateResponse extends SuccessResponse {
  user: {
    id: string;
    name: string;
    email: string;
    address: string;
  };
}

export interface UserSuccessDeleteResponse extends SuccessResponse {
  user: {
    id: string;
  };
}

export enum ValidRoles {
  ADMIN = 'ADMIN',
  MANTAINER = 'MANTAINER',
  USER = 'USER',
  BUYER = 'BUYER',
  SELLER = 'SELLER',
}
