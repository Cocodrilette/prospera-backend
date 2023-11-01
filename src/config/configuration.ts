import { CieloContractData } from 'src/blockchain/contracts';

export default () => ({
  providers: {
    payment: {
      paypal: {
        clientId: process.env.PAYPAL_CLIENT_ID,
        clientSecret: process.env.PAYPAL_CLIENT_SECRET,
        baseUrl: process.env.PAYPAL_BASE_URL,
        authPath: process.env.PAYPAL_AUTH_PATH,
        ordersPath: process.env.PAYPAL_ORDERS_PATH,
      },
    },
  },
  contracts: {
    cielo: {
      address: process.env.CIELO_CONTRACT_ADDRESS,
      abi: CieloContractData.abi,
    },
  },
});
