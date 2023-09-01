interface Amount {
  amount: {
    currency_code: string;
    value: string;
  };
}

export class PaypalOrderDto {
  intent = 'CAPTURE';
  purcharse_units: Amount[];
}
