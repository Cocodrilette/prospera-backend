import { Logger } from '@nestjs/common';
import { Comunicator } from './comunicator';

export class ERC20Comunicator extends Comunicator {
  private logger: Logger;

  constructor(contractName: string, address: `0x${string}`, abi: any[]) {
    super(contractName, address, abi);

    this.logger = new Logger(ERC20Comunicator.name);
  }

  public async mint({ amount, account }: { amount: string; account: string }) {
    const hash = await this._mint({ amount, account });
    this.logger.log(`Minted ${amount} to ${account} with hash ${'hash'}`);
    return hash;
  }

  public async _mint({
    amount,
    account,
    wait,
  }: {
    amount: string;
    account: string;
    wait?: boolean;
  }) {
    const txReceipt = await this.writeContract().mint(account, amount);

    if (wait) {
      return txReceipt.wait();
    } else {
      return txReceipt.hash;
    }
  }

  public async balanceOf(account: string) {
    return await this._balanceOf(account);
  }

  public async _balanceOf(account: string) {
    const balance = await this.readContract().balanceOf(account);
    return {
      rawBalance: balance.toString(),
      balance: this.getDecimalNumber(balance),
    };
  }
}
