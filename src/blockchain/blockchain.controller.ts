import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { CreateBlockchainDto } from './dto/create-blockchain.dto';
import { UpdateBlockchainDto } from './dto/update-blockchain.dto';
import { ApiKeyGuard } from 'src/auth/guard/api-key.guard';

@UseGuards(ApiKeyGuard)
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post()
  create(@Body() createBlockchainDto: CreateBlockchainDto) {
    return this.blockchainService.create(createBlockchainDto);
  }

  @Post('mint')
  mint(@Body() mintParams: { to: string; amount: number }) {
    return this.blockchainService.mint(mintParams);
  }

  @Get()
  findAll() {
    return this.blockchainService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blockchainService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlockchainDto: UpdateBlockchainDto,
  ) {
    return this.blockchainService.update(+id, updateBlockchainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blockchainService.remove(+id);
  }

  @Get('balance/:address')
  balanceOf(@Param('address') address: string) {
    return this.blockchainService.balanceOf(address);
  }
}
