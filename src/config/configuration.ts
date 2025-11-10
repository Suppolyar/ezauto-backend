export default () => ({
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  API_PREFIX: process.env.API_PREFIX ?? 'api',
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_SSL:
    (process.env.DATABASE_SSL ?? '').length > 0
      ? process.env.DATABASE_SSL
      : undefined,
  JWT_SECRET: process.env.JWT_SECRET,
  PUSH_PROVIDER_URL:
    process.env.PUSH_PROVIDER_URL ?? 'https://exp.host/--/api/v2/push/send',
});
