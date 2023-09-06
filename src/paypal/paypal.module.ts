import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PaypalService],
})
export class PaypalModule {}
