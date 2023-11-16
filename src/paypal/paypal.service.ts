import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, catchError } from 'rxjs';
import { AuthResponseDto } from './types/authResponde.types';
import { btoa } from 'buffer';
import { CreateOrderResponse, Intent } from './types/order.types';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class PaypalService {
  private readonly logger = new Logger(PaypalService.name);
  private paypalAuthToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getPaypalAuthToken(): Promise<string> {
    if (this.paypalAuthToken) return this.paypalAuthToken;

    const authUrl = this.getPaypalAuthUrl();
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: this.getPaypalAuthHeader(),
      },
    };
    const body = {
      grant_type: 'client_credentials',
    };

    const response = await firstValueFrom(
      this.httpService.post<AuthResponseDto>(authUrl, body, options).pipe(
        catchError((error) => {
          this.logger.error(error);
          throw error;
        }),
      ),
    );

    this.paypalAuthToken = response.data.access_token;

    return this.paypalAuthToken;
  }

  async createOrder(orderObject: Order) {
    const orderUrl = this.getPaypalOrderUrl();
    const body = {
      intent: Intent.CAPTURE,
      purchase_units: [
        {
          amount: {
            currency_code: orderObject.currency,
            value: orderObject.tokenPrice * orderObject.tokensAmount,
          },
        },
      ],
    };
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this.getPaypalAuthToken()}`,
        'PayPal-Request-Id': orderObject.requestId,
      },
    };

    const response = await firstValueFrom(
      this.httpService.post<CreateOrderResponse>(orderUrl, body, options).pipe(
        catchError((error) => {
          this.logger.error(error);
          throw error;
        }),
      ),
    );

    return response.data;
  }

  private getPaypalAuthHeader(): string {
    const paypalSecret = this.configService.get<string>(
      'providers.payment.paypal.clientSecret',
    );
    const paypalClientId = this.configService.get<string>(
      'providers.payment.paypal.clientId',
    );

    return `Basic ${btoa(`${paypalClientId}:${paypalSecret}`)}`;
  }

  private getPaypalAuthUrl(): string {
    const baseUrl = this.configService.get<string>(
      'providers.payment.paypal.baseUrl',
    );
    const paypalAuthUrl = this.configService.get<string>(
      'providers.payment.paypal.authPath',
    );

    return `${baseUrl}${paypalAuthUrl}`;
  }

  private getPaypalOrderUrl(): string {
    const baseUrl = this.configService.get<string>(
      'providers.payment.paypal.baseUrl',
    );
    const paypalCreateOrderUrl = this.configService.get<string>(
      'providers.payment.paypal.ordersPath',
    );

    return `${baseUrl}${paypalCreateOrderUrl}`;
  }
}
