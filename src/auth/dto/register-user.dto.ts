import {
  Length,
  IsEmail,
  IsNumber,
  IsString,
  IsEthereumAddress,
} from 'class-validator';

export class RegisterUserDto {
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
}
