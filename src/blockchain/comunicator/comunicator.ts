import { ConfigModule } from '@nestjs/config';
import { Contract, Wallet, ethers } from 'ethers';

export class Comunicator {
  private _contractInstance: Contract;

  constructor(
    private readonly contractName: string,
    private readonly address: `0x${string}`,
    private readonly abi: any[],
  ) {}

  get name(): string {
    return this.contractName;
  }

  get addr(): string {
    return this.address;
  }

  get interface(): any[] {
    return this.abi;
  }

  readContract(): Contract {
    const contract = this._getContractInstance();
    return contract;
  }

  writeContract(): Contract {
    const contract = this._getContractInstance();
    const signer = this._getSigner();

    return contract.connect(signer) as Contract;
  }

  getDecimalNumber(number: bigint) {
    return parseInt(ethers.formatEther(number.toString()));
  }

  private _getContractInstance(): Contract {
    if (!this._contractInstance) {
      const provider = this._getProvider();
      this._contractInstance = new Contract(this.address, this.abi, provider);
    }

    return this._contractInstance;
  }

  _getSigner() {
    const privateKey = this._getPrivateKey();
    const provider = this._getProvider();

    console.log({ privateKey });

    const signer = new Wallet(privateKey, provider);
    return signer;
  }

  private _getProvider() {
    const httpProviderUrl = this._getHttpProviderUrl();
    return new ethers.JsonRpcProvider(httpProviderUrl);
  }

  private _getHttpProviderUrl() {
    if (process.env.NODE_ENV === 'test') {
      return 'http://localhost:8545';
    } else if (process.env.NODE_ENV === 'development') {
      return process.env.TESTNET_RPC_URL;
    } else {
      return 'http://localhost:8545';
    }
  }

  private _getPrivateKey() {
    if (process.env.NODE_ENV === 'test') {
      return process.env.LOCAL_SIGNER as `0x${string}`;
    } else if (process.env.NODE_ENV === 'development') {
      return process.env.DEFAULT_SIGNER;
    } else {
      return process.env.LOCAL_SIGNER as `0x${string}`;
    }
  }
}
