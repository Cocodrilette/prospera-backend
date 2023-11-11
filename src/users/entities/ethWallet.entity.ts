import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class EthWallet {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true, type: String })
  privateKey: string;

  @Prop({ required: true, type: String })
  mnemonic: string;
}

export const EthWalletSchema = SchemaFactory.createForClass(EthWallet);
