import { z } from "zod";

export const mediaSchema = z.object({
  url: z.string().url(),
  path: z.string()
})