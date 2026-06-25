import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default('https://uniblox-assigment-rudransh.vercel.app/api'),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

if (!_env.success) {
  console.error('❌ Invalid frontend environment variables:');
  console.error(_env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
