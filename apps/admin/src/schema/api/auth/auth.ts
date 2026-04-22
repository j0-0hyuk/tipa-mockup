import { z } from 'zod/v4';

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
