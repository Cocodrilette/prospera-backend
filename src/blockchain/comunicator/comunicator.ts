import { Contract, Wallet, ethers } from 'ethers';
import { hardhat, polygonZkEvmTestnet } from 'viem/chains';

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

  private _getContractInstance(): Contract {
    if (!this._contractInstance) {
      const provider = this._getProvider();
      this._contractInstance = new Contract(this.address, this.abi, provider);
    }

    return this._contractInstance;
  }

  private _getSigner() {
    const privateKey = this._getPrivateKey();
    const provider = this._getProvider();

    const signer = new Wallet(privateKey, provider);
    return signer;
  }

  private _getProvider() {
    const chain = this._getChain();
    const httpProviderUrl = this._getHttpProviderUrl();

    return new ethers.JsonRpcProvider(httpProviderUrl);
  }

  private _getChain() {
    if (process.env.NODE_ENV === 'test') {
      return hardhat;
    } else if (process.env.NODE_ENV === 'development') {
      return polygonZkEvmTestnet;
    } else {
      return hardhat;
    }
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
    return (process.env.DEFAULT_SIGNER ||
      process.env.LOCAL_SIGNER) as `0x${string}`;
  }
}
