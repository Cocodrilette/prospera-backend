import { ConfigModule } from '@nestjs/config';
import {
  Cipher,
  Decipher,
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto';
import { HDNodeWallet } from 'ethers';

export class CryptoAdapter {
  private algorithm = 'aes-256-ctr';
  private _cypherKey: string;
  private initVector: Buffer = randomBytes(16);

  constructor(signKey: string) {
    this._cypherKey = signKey;
  }

  encrypt(plainText: string): string {
    console.log({
      plainText,
      _cypherKey: this._cypherKey,
      initVector: this.initVector,
      algorithm: this.algorithm,
    });

    const cipher = createCipheriv(
      this.algorithm,
      this._cypherKey,
      this.initVector,
    );

    return Buffer.concat([cipher.update(plainText), cipher.final()]).toString();
  }

  decrypt(encryptedText: string): string {
    const decipher = createDecipheriv(
      this.algorithm,
      this._cypherKey,
      this.initVector,
    );

    return Buffer.concat([
      decipher.update(Buffer.from(encryptedText, 'hex')),
      decipher.final(),
    ]).toString();
  }

  createEthWallet(): HDNodeWallet {
    const password =
      'prospera-platform' +
      process.constrainedMemory.toString() +
      Date.now().toString() +
      process.cpuUsage().user.toString();

    return HDNodeWallet.createRandom(password);
  }
}
