import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Currency, OrderStatus } from '../paypal/types/order.types';
import { PaypalService } from '../paypal/paypal.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './schemas/order.schema';
import {
  CreateOrderResponse,
  OrderUpdateSuccess,
} from './types/responses.types';
import { BlockchainService } from 'src/blockchain/blockchain.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly paypalService: PaypalService,
    private readonly blockchainService: BlockchainService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<CreateOrderResponse> {
    console.log({ createOrderDto });
    const order = await this.createOrderObject(createOrderDto);
    const paypalOrder = await this.paypalService.createOrder(order);

    if (paypalOrder.id) {
      order.paypalOrderId = paypalOrder.id;
      this.updateOrderBy('requestId', order.requestId, order);
    }

    return { orderID: paypalOrder.id };
  }

  async complete(orderID: string): Promise<OrderUpdateSuccess> {
    console.log({ orderID });
    const order = await this.findOneOrderBy('paypalOrderId', orderID);
    order.status = OrderStatus.COMPLETED;

    await this.updateOrderBy('paypalOrderId', orderID, order);
    await this.blockchainService.erc20Cielo.mint({
      account: order.userAddress,
      amount: BigInt(order.tokensAmount * 1e18).toString(),
    });

    return { orderID };
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  private async findOneOrderBy<K extends keyof Order>(
    property: K,
    value: Order[K],
  ) {
    const order = await this.orderModel.findOne({ [property]: value });

    if (order) return order;
    throw new NotFoundException(`Order with ${property}: ${value} not found`);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {}

  private async updateOrderBy<K extends keyof Order>(
    property: K,
    value: Order[K],
    order: Order,
  ) {
    try {
      const updatedOrder = await this.orderModel.findOneAndUpdate(
        { [property]: value },
        order,
      );

      this.logger.debug(`Order ${updatedOrder._id} updated`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  private async createOrderObject(
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const order = new this.orderModel({
      userAddress: createOrderDto.userAddress,
      tokensAmount: createOrderDto.tokensAmount,
      currency: Currency.USD,
      tokenPrice: 1.0,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      requestId: uuidv4(),
    });

    const createdOrder = await order.save();

    return createdOrder;
  }
}
