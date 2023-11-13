import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { HDNodeWallet, keccak256, toUtf8Bytes } from 'ethers';

export class CryptoAdapter {
  private static algorithm = 'aes-256-ctr';
  private static initVector: Buffer = randomBytes(16);
  private static signKey: Buffer;

  constructor(signingKey: string) {
    const hash = keccak256(toUtf8Bytes(signingKey));
    let buffer = Buffer.from(hash, 'utf-8');

    if (buffer.length < 32) {
      const padding = Buffer.alloc(32 - buffer.length);
      buffer = Buffer.concat([buffer, padding]);
    } else if (buffer.length > 32) {
      buffer = buffer.subarray(0, 32);
    }

    CryptoAdapter.signKey = buffer;
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
    );

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
