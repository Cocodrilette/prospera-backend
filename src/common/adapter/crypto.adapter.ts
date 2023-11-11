import crypto, { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { HDNodeWallet, toUtf8Bytes } from 'ethers';

export class CryptoAdapter {
  private static algorithm = 'aes-256-ctr';
  private static initVector: Buffer = randomBytes(16);
  private static signKey: Buffer;

  constructor(signingKey: string) {
    const keyBytes = toUtf8Bytes(signingKey);
    if (!keyBytes) {
      throw new Error('Invalid signing key');
    }

    const buffer = Buffer.from(keyBytes);
    const safeBuffer = buffer.length > 32 ? buffer.subarray(0, 32) : buffer;

    CryptoAdapter.signKey = safeBuffer;
  }

  encrypt(plainText: string): string {
    console.log({
      plainText,
      _cypherKey: CryptoAdapter.signKey,
      initVector: CryptoAdapter.initVector,
      algorithm: CryptoAdapter.algorithm,
    });

    const cipher = createCipheriv(
      CryptoAdapter.algorithm,
      CryptoAdapter.signKey,
      CryptoAdapter.initVector,
    ); // @todo fix this

    return Buffer.concat([cipher.update(plainText), cipher.final()]).toString(
      'hex',
    );
  }

  decrypt(encryptedText: string): string {
    const decipher = createDecipheriv(
      CryptoAdapter.algorithm,
      CryptoAdapter.signKey,
      CryptoAdapter.initVector,
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
