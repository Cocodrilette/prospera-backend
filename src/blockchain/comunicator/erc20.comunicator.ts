import { Logger } from '@nestjs/common';
import { Comunicator } from './comunicator';
import { ethers } from 'ethers';

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

  public async _mint({ amount, account }: { amount: string; account: string }) {
    const txReceipt = await this.writeContract().mint(account, amount);
    return txReceipt.wait();
  }

  public async balanceOf(account: string) {
    return await this._balanceOf(account);
  }

  public async _balanceOf(account: string) {
    const balance = await this.readContract().balanceOf(account);
    return {
      rawBalance: balance.toString(),
      balance: parseInt(ethers.formatEther(balance.toString())),
    };
  }
}
