import {
  Length,
  IsEmail,
  IsString,
  IsEthereumAddress,
  IsOptional,
} from 'class-validator';

export class CreateClerkUserDto {
  @IsOptional()
  @IsEthereumAddress()
  address?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  name?: string;

  @IsEmail()
  email: string;

  @IsString()
  clerkId: string;
}
