import { CieloContractData } from '../blockchain/contracts';

export default () => ({
  blockchain: {
    signingKeys: {
      default:
        process.env.NODE_ENV === 'test'
          ? process.env.LOCAL_SIGNER
          : process.env.DEFAULT_SIGNER,
    },
    httpProviderUrl: {
      default:
        process.env.NODE_ENV === 'test'
          ? 'http://localhost:8545'
          : process.env.TESTNET_RPC_URL,
    },
  },
  enviroment: {
    jwtSecret: process.env.JWT_SECRET,
    signKey: process.env.ENCRYPTION_SIGNING_KEY,
  },
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
