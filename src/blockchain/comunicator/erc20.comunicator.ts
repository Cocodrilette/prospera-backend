import { Comunicator } from './comunicator';

export class ERC20Comunicator extends Comunicator {
  constructor(contractName: string, address: `0x${string}`, abi: any[]) {
    super(contractName, address, abi);
  }

  public async mint({ amount, account }: { amount: string; account: string }) {
    const hash = await this._mint({ amount, account });
    return hash;
  }

  public async _mint({ amount, account }: { amount: string; account: string }) {
    return this.writeContract({
      address: this.addr as `0x${string}`,
      abi: this.interface,
      functionName: 'mint',
      args: [account, amount],
    });
  }
}
