import { Injectable, Logger } from '@nestjs/common';
import { CreateBlockchainDto } from './dto/create-blockchain.dto';
import { UpdateBlockchainDto } from './dto/update-blockchain.dto';
import { ERC20Comunicator } from './comunicator';
import { CieloContractData } from './contracts';

export interface ContractData {
  address: `0x${string}`;
  abi: any[];
}

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);

  erc20CieloContract: ERC20Comunicator;

  get erc20Cielo() {
    if (!this.erc20CieloContract) {
      this.erc20CieloContract = new ERC20Comunicator(
        'Cielo',
        this.erc20CieloContractData.address,
        this.erc20CieloContractData.abi,
      );
    }

    return this.erc20CieloContract;
  }

  get erc20CieloContractData(): ContractData {
    return {
      address: CieloContractData.address,
      abi: CieloContractData.abi,
    };
  }

  mint({ to, amount }: { to: string; amount: number }) {
    try {
      this.erc20Cielo.mint({ account: to, amount: amount.toString() });
    } catch (error) {
      this.logger.error(error);
    }
  }

  create(createBlockchainDto: CreateBlockchainDto) {
    return 'This action adds a new blockchain';
  }

  findAll() {
    return `This action returns all blockchain`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blockchain`;
  }

  update(id: number, updateBlockchainDto: UpdateBlockchainDto) {
    return `This action updates a #${id} blockchain`;
  }

  remove(id: number) {
    return `This action removes a #${id} blockchain`;
  }
}
