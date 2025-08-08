export default () => ({
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  API_PREFIX: process.env.API_PREFIX ?? 'api',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
});
