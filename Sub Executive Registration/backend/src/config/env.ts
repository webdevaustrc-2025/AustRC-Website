import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().max(65535).default(5000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required.'),
  FRONTEND_URLS: z.string().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid backend environment variables:');
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = {
  ...parsed.data,
  frontendUrls: parsed.data.FRONTEND_URLS.split(',')
    .map((url) => url.trim().replace(/\/$/, ''))
    .filter(Boolean),
};
