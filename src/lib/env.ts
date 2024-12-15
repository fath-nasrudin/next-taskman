import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z
    .string()
    .optional()
    .default(
      process.env.NEXT_PUBLIC_BASE_URL
        ? `${
            process.env.NEXT_PUBLIC_BASE_URL.startsWith('http')
              ? ''
              : 'https://'
          }${process.env.NEXT_PUBLIC_BASE_URL}`
        : 'http://localhost:3000'
    ),
});

export const env = envSchema.parse(process.env);
