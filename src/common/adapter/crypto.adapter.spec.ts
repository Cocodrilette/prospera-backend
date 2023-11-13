import { HDNodeWallet } from 'ethers';
import { CryptoAdapter } from './crypto.adapter';

describe('CryptoAdapter', () => {
  const SIGNING_KEY = 'test';
  const cryptoAdapter = new CryptoAdapter(SIGNING_KEY);

  it('should be defined', () => {
    expect(cryptoAdapter).toBeDefined();
  });

  it('should encrypt and decrypt', () => {
    const plainText = 'plain text';

    const encryptedText = cryptoAdapter.encrypt(plainText);
    expect(encryptedText).not.toEqual(plainText);

    const decryptedText = cryptoAdapter.decrypt(encryptedText);
    expect(decryptedText).toEqual(plainText);
  });

  it('should create a wallet', () => {
    const wallet = cryptoAdapter.createEthWallet();

    expect(wallet).toBeInstanceOf(HDNodeWallet);
  });

  it('should create and encrypt their secrets', () => {
    const wallet = cryptoAdapter.createEthWallet();

    const encryptedPrivateKey = cryptoAdapter.encrypt(wallet.privateKey);
    expect(encryptedPrivateKey).not.toEqual(wallet.privateKey);

    const decryptedPrivateKey = cryptoAdapter.decrypt(encryptedPrivateKey);
    expect(decryptedPrivateKey).toEqual(wallet.privateKey);

    const encryptedMnemonic = cryptoAdapter.encrypt(wallet.mnemonic.phrase);
    expect(encryptedMnemonic).not.toEqual(wallet.mnemonic.phrase);

    const decryptedMnemonic = cryptoAdapter.decrypt(encryptedMnemonic);
    expect(decryptedMnemonic).toEqual(wallet.mnemonic.phrase);
  });
});
