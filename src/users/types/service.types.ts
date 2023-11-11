import { User } from '../entities/user.entity';

export type RawUser = User;
export type FilteredUserResponse = {
  id: string;
  name: string;
  email: string;
  address: string;
};

export type FindMethodOptions = {
  raw: boolean;
};
