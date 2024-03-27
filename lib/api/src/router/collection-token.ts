import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { ACTIVITY_TYPE } from "@marketplace/db";

export const collectionTokenRouter = createTRPCRouter({
  getCollectionTokens: publicProcedure
    .input(
      z.object({
        auction: z.enum(['LISTING', 'NOT_SALE']).optional(),
        slug: z.string().optional(),
        address: z.string().optional(),
        take: z.number().optional(),
        tokenId: z.string().optional(),
        excludeTokenId: z.string().optional(),
        rank: z.object({
          min: z.string().optional(),
          max: z.string().optional()
        }).optional(),
        price: z.object({
          min: z.string().optional(),
          max: z.string().optional()
        }).optional(),
        traits: z.array(z.object({ trait_type: z.string(), value: z.string() })).default([]),
      })
    ).query(async ({ ctx, input }) => {
      let query = `
        select tct.*,tc.address, tc.metadata->>'totalSupply' as total_supply, ta.type, ta.price , ta.active, ta."listingId" , ta.seller from tbl_collection_token tct
      `
      if (input.traits.length > 0) {
        query += ` CROSS JOIN LATERAL json_array_elements(to_json(tct."attributes")) AS _traits`
      }
      query += `
        left join  tbl_collection tc on tc.id = tct.collection_id
        left join  tbl_latest_collection_token_activity tlcta on tct.id = tlcta.collection_token_id
        left join  tbl_activity ta on ta.id = tlcta.activity_id
        where 1=1
      `
      if (input.address) {
        query += `and  tc.address = '${input.address}' `
      }
      if (input.slug) {
        query += `and  tc.slug = '${input.slug}' `
      }
      if (input.tokenId) {
        query += ` and tct.token_id like '%${input.tokenId}%'`
      }
      if (input.excludeTokenId) {
        query += ` and tct.token_id != '${input.excludeTokenId}'`
      }
      if (input.auction) {
        if (input.auction === 'LISTING') {
          query += ` and ta.type = 'LISTING'`
        }
        if (input.auction === 'NOT_SALE') {
          query += ` and ta.type != 'LISTING'`
        }
      }
      if (input.price) {
        query += ` and ta.type = 'LISTING'`
        if (input.price.min) {
          query += ` and ta.price::float <= ${input.price.min}`
        }
        if (input.price.max) {
          query += ` and ta.price::float >= ${input.price.max}`
        }
      }
      if (input.rank) {
        if (input.rank.min) {
          query += ` and (tct.rarity->>'rank')::int <= ${input.rank.min}`
        }
        if (input.rank.max) {
          query += ` and (tct.rarity->>'rank')::int >= ${input.rank.max}`
        }
      }
      if (input.traits.length > 0) {
        query += `and ${input.traits.map(trait => ` _traits->>'trait_type' like '%${trait.trait_type}%' and  _traits->>'value' like '%${trait.value}%'`).join(' or ')}`
      }

      query += ` ORDER BY CASE WHEN ta.type = 'LISTING' THEN 0 ELSE 1 END, ta.price::float`;
      if (input.take) {
        query += ` LIMIT ${input.take}`
      }
      console.log(query);
      return ctx.prisma.$queryRawUnsafe(query)
    }),

  getCollectionTokensByTokenId: publicProcedure
    .input(
      z.object({
        address: z.string(),
        tokenId: z.string(),
      })
    ).query(({ ctx, input }) => {
      return ctx.prisma.collectionToken.findFirst({
        where: {
          collection: {
            address: input.address
          },
          tokenId: input.tokenId
        },
        select: {
          image: true,
          id: true,
          attributes: true,
          metadata: true,
          rarity: true,
          tokenId: true,
          name: true,
          collection: {
            select: {
              address: true,
              metadata: true,
              traits: true,
              slug: true,
              logoMedia: {
                select: {
                  url: true
                }
              }
            }
          },
          latestActivity: {
            select: {
              activity: true
            }
          }
        },
      })
    }),

  getCollectionTokenActivity: publicProcedure
    .input(
      z.object({
        address: z.string(),
        tokenId: z.string(),
        type: z.nativeEnum(ACTIVITY_TYPE).optional(),
      })
    ).query(({ ctx, input }) => {
      return ctx.prisma.activity.findMany({
        where: {
          collectionToken: {
            collection: {
              address: input.address
            },
            tokenId: input.tokenId
          },
          type: input.type ?? undefined
        },
        include: {
          collectionToken: {
            select: {
              image: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 10
      })
    }),

});
