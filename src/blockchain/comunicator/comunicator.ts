import {
  http,
  PublicClient,
  WalletClient,
  PrivateKeyAccount,
  createPublicClient,
  createWalletClient,
} from 'viem';
import { Chain } from 'viem/_types/types/chain';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat, polygonZkEvmTestnet } from 'viem/chains';

interface ContractCallParams {
  address: `0x${string}`;
  functionName: string;
  abi: any[];
  args: any[];
}

export class Comunicator {
  private _publicClient: PublicClient;
  private _walletClient: {
    client: WalletClient;
    account: PrivateKeyAccount;
    chain: Chain;
  };

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

  readContract({ address, abi, args, functionName }: ContractCallParams) {
    const client = this._getPublicClient();
    return client.readContract({
      address,
      abi,
      args,
      functionName,
    });
  }

  private _getPublicClient(): PublicClient {
    if (!this._publicClient) {
      this._publicClient = createPublicClient({
        chain: this._getChain(),
        transport: http(this._getHttpProviderUrl()),
      });
    }

    return this._publicClient;
  }

  async writeContract({
    address,
    abi,
    args,
    functionName,
  }: ContractCallParams) {
    const { client, account, chain } = this._getWalletClient();

    return client.writeContract({
      address,
      abi,
      args,
      functionName,
      account,
      chain,
    });
  }

  private _getWalletClient(): {
    client: WalletClient;
    account: PrivateKeyAccount;
    chain: Chain;
  } {
    if (!this._walletClient) {
      const pk = this._getPrivateKey();
      const account = privateKeyToAccount(pk);
      const chain = this._getChain();
      const client = createWalletClient({
        account,
        chain,
        transport: http(),
      });

      this._walletClient = {
        client,
        account,
        chain,
      };
    }

    return this._walletClient;
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
