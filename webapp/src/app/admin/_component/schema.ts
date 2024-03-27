import { z } from "zod";
import { mediaSchema } from '@marketplace/api/schema'
export const CollectionFormSchema = z.object({
  metadata: z.object({
    name: z.string(),
    description: z.string().optional(),
    discord: z.string().optional(),
    twitter: z.string().optional(),
    telegram: z.string().optional(),
    web: z.string().optional(),
  }),
  logo: mediaSchema,
  banner: mediaSchema,
  slug: z.string(),
  contractAddress: z.string(),
  creatorAddress: z.string(),
  feePercent: z.number(),
  totalSupply: z.number(),
});


export type CollectionFormSchema = z.infer<typeof CollectionFormSchema>