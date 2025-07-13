import * as z from 'zod';

export type Config = {
  host: string;
  port: number;
  environment: 'local' | 'development';
};

export const getConfig = (): Config => {
  const envSchema = z.object({
    host: z.string(),
    port: z.number(),
    environment: z.enum(['local', 'development']).default('local'),
  });

  return envSchema.parse({
    host: process.env.HOST ?? 'localhost',
    port: Number(process.env.PORT ?? 3000),
    environment: process.env.NODE_ENV ?? 'local',
  });
};
