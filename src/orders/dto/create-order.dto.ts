import { IsNumber, IsString, Length } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @Length(42, 42)
  userAddress: string;

  @IsNumber()
  tokensAmount: number;
}
