import { z } from 'zod';

export const authResponseSchema = z
  .object({
    data: z.object({
      accessToken: z.string(),
      refreshToken: z.string()
    })
  })
  .transform(({ data }) => ({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken
  }));
