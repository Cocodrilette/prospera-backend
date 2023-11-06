import { Length, IsEmail, IsString, IsEthereumAddress } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 255)
  password: string;
}
