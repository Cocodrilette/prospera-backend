import {
  Length,
  IsEmail,
  IsNumber,
  IsString,
  IsEthereumAddress,
  IsEnum,
} from 'class-validator';
import { ValidRoles } from '../types/user.types';

export class CreateUserDto {
  @IsEthereumAddress()
  address: string;

  @IsString()
  @Length(1, 255)
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  age: number;

  @IsString()
  @Length(8, 255)
  password: string;

  @IsEnum(ValidRoles)
  role: ValidRoles;
}
