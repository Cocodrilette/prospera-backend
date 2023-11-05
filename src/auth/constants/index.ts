export const authConstants = {
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    signOptions: { expiresIn: '10h' },
  },
};
