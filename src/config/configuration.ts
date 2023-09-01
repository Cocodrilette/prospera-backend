export default () => ({
  providers: {
    payment: {
      paypal: {
        clientId: process.env.PAYPAL_CLIENT_ID,
        clientSecret: process.env.PAYPAL_CLIENT_SECRET,
        baseUrl: process.env.PAYPAL_BASE_URL,
        authUrl: process.env.PAYPAL_AUTH_URL,
        ordersUrl: process.env.PAYPAL_ORDERS_URL,
      },
    },
  },
});
