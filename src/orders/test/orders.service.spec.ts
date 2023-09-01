import { getModelToken } from '@nestjs/mongoose';

import { Order } from '../schemas/order.schema';
import { orderModel } from './utils/mockedModel';
import { OrdersService } from '../orders.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: orderModel,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
