import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const shouldUseSSL = (process.env.DATABASE_SSL ?? '').toLowerCase() === 'true';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: shouldUseSSL ? { rejectUnauthorized: false } : undefined,
  synchronize: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
