import { ACTIVITY_TYPE, Prisma, prisma } from "@marketplace/db";
import { z } from "zod";
import { mediaSchema } from "../schema/media";
import { duration, findLowestPriceWithLatestActivity, getCollectionStats, getMediaUrl, getTopCollectionsWithSoldActivityCount } from "../service/collection";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TopCollection } from "../types";

export const collectionRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        address: z.string(),
        slug: z.string(),
        metadata: z.any().default({}),
        logo: mediaSchema,
        banner: mediaSchema,
      })
    ).mutation(({ ctx, input }) => {
      const { banner, logo, address, metadata, slug } = input
      return ctx.prisma.collection.create({
        data: {
          slug,
          metadata,
          address,
          logoMedia: {
            create: {
              ...logo
            }
          },
          bannerMedia: {
            create: {
              ...banner,
            }
          },
          queue: {
            create: {}
          }
        }
      })
    }),
  getSlugFromAddress: publicProcedure
    .input(
      z.object({
        address: z.string(),
      })
    ).query(({ ctx, input }) => {
      return ctx.prisma.collection.findUnique({
        where: {
          address: input.address
        },
        select: {
          slug: true,
          metadata: true
        }
      })
    }),
  getTopCollections: publicProcedure
    .input(
      z.object({
        duration: z.enum(duration).default(''),
        take: z.number().default(5)
      })
    )
    .query(async ({ input }) => {
      const [collections, currentFloorPrices, lastFloorPrice] = await Promise.all([
        getTopCollectionsWithSoldActivityCount(input.duration, input.take),
        findLowestPriceWithLatestActivity(''),
        findLowestPriceWithLatestActivity(input.duration)
      ])

      return collections
        .sort((a, b) => b.volume - a.volume)
        .map<TopCollection>((collection, idx) => ({
          ...collection,
          rank: idx + 1,
          floorPrice: currentFloorPrices.find((item: any) => item.id === collection.id)?.floor || '0',
          lastFloorPrice: lastFloorPrice.find((item: any) => item.id === collection.id)?.floor || '0',
        }))

    }),
  getByAddress: publicProcedure
    .input(
      z.object({
        address: z.string(),
        slug: z.string().optional(),
      })
    ).query(({ ctx, input }) => {
      return ctx.prisma.collection.findFirst({
        where: {
          OR: [
            {
              address: input.address
            },
            {
              slug: input.slug ?? undefined
            }
          ],
        },
        include: {

          bannerMedia: true,
          logoMedia: true,
          collectionTokens: {
            select: {
              activity: {
                where: {
                  type: {
                    not: 'WITHDRAW'
                  }
                },
              },
              latestActivity: {
                select: {
                  activity: {
                    select: {
                      price: true, active: true
                    }
                  },
                }
              }
            }
          },
        },
      })
    }),
  getCollectionTokens: publicProcedure
    .input(
      z.object({
        address: z.string(), take: z.number().default(30),
        tokenId: z.string().optional(),
        rank: z.object({
          min: z.string().optional(),
          max: z.string().optional()
        }).optional(),
        price: z.object({
          min: z.string().optional(),
          max: z.string().optional()
        }).optional(),
        traits: z.array(z.object({ trait_type: z.string(), value: z.string() })).default([])
      })
    ).query(async ({ ctx, input }) => {
      let tokenIds: string[] = []
      if (input.traits.length > 0 && !input.tokenId) {
        let str = input.traits.map(trait => `or j->>'trait_type' like '%${trait.trait_type}%' and  j->>'value' like '%${trait.value}%'`).join(' ')
        const attributes = await ctx.prisma.$queryRawUnsafe(`
          SELECT token_id FROM tbl_collection_token tct cross join lateral json_array_elements(to_json(tct."attributes")) as j left join tbl_collection tc on tc.id = tct.collection_id WHERE 1=1 and tc.address = '${input.address}' ${str}
        `) as any[]
        console.log('in');
        tokenIds = attributes.map(t => t.token_id)
      }
      return ctx.prisma.collectionToken.findMany({
        where: {
          collection: {
            address: input.address
          },
          tokenId: input.tokenId ? {
            contains: input.tokenId,
            mode: 'insensitive'
          } : tokenIds.length > 0 ? { in: tokenIds } : undefined,
          rarity: Object.hasOwn(input, 'rank') ? {
            path: ["rank"],
            lte: input.rank?.min ?? undefined,
            gte: input.rank?.max ?? undefined
          } : undefined,
          activity: Object.hasOwn(input, 'price') ? {
            some: {
              type: "LISTING",
              price: {
                lte: input.price?.min ?? undefined,
                gte: input.price?.max ?? undefined
              }
            }
          } : undefined,
        },
        include: {
          activity: {
            take: 2,
            orderBy: {
              createdAt: 'desc'
            },
          },
        },
        // take: input.take,
        orderBy: {
          activity: {
            _count: "desc"
          }
        }
      }).then(async collectionTokens => {
        if (input.traits.length === 0) {
          return collectionTokens;
        }


        return collectionTokens.filter(a => tokenIds.includes(a.tokenId))
      })
    }),




  getCollectionActivity: publicProcedure
    .input(
      z.object({
        type: z.nativeEnum(ACTIVITY_TYPE).optional(),
        address: z.string().optional(),
        slug: z.string().optional(),
        take: z.number().default(10),
        skip: z.number().default(0),
        tokenIds: z.array(z.string()).default([])
      })
    ).query(async ({ ctx, input }) => {
      const _filter: Prisma.ActivityFindManyArgs['where'] = {
        collectionToken: {
          collection: {
            address: input.address,
            slug: input.slug
          }
        },
        tokenId: input.tokenIds.length ? {
          in: input.tokenIds
        } : undefined,
        type: input.type

      }
      const activities = await ctx.prisma.activity.findMany({
        where: {
          ..._filter
        },
        include: {
          collectionToken: {
            select: {
              name: true,
              image: true,
              tokenId: true,
              collection: {
                select: {
                  address: true,
                  slug: true
                }
              }
            }
          },
        },
        take: input.take,
        skip: input.skip,
        orderBy: {
          createdAt: 'desc'
        }
      })
      const count = await ctx.prisma.activity.count({
        where: {
          ..._filter
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return { count, activities }
    }),

  get: publicProcedure
    .input(
      z.object({
        address: z.string().optional(),
        name: z.string().optional(),
        take: z.number().default(10)
      })
    ).query(({ ctx, input }) => {

      let q = `SELECT tc.* , tm.url as banner, tmm.url as logo  FROM tbl_collection tc left join tbl_media tm on tm.id = tc.banner left join tbl_media tmm on tmm.id = tc.logo where 1=1`;
      if (input.address) {
        q += ` and tc.address = '${input.address}'`
      }
      if (input.name) {
        q += ` and tc.metadata->>'name' ilike '%${input.name}%'`
      }

      q += ` LIMIT ${input.take}`

      return prisma.$queryRawUnsafe(q) as unknown as any[];
    }),

  getCollectionForUserProfile: publicProcedure
    .input(
      z.object({
        query: z.array(z.object({ address: z.string(), tokenId: z.string() }))
      })
    ).mutation(({ ctx, input }) => {
      return ctx.prisma.collectionToken.findMany({
        where: {
          collection: {
            address: {
              in: input.query.map(q => q.address)
            }
          },
          tokenId: {
            in: input.query.map(q => q.tokenId)
          }
        },
        include: {
          collection: true,
          latestActivity: {
            select: {
              activity: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    })
  ,


  getCollectionStats: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    ).query(({ ctx, input }) => {
      return getCollectionStats(input.slug)
    }),


  getChartData: publicProcedure.input(
    z.object({
      slug: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const collectionFilter = `AND tc.slug = '${input.slug}'`; // Replace 'yourAddress' and 'yourSlug' with the desired collection filter values

    let q = `
      SELECT 
        DATE_TRUNC('hour', ta.created_at) as hour,
        COALESCE(COUNT(ta.id), 0) as sold_activity_count,
        COALESCE(SUM(ta.price::numeric), 0) as volume,
        tc.address
      FROM tbl_collection tc
      LEFT JOIN tbl_activity ta ON tc.address = ta.contract_address AND ta.type = 'SOLD'
      WHERE 1=1 ${collectionFilter}
      GROUP BY hour, tc.address
      ORDER BY hour DESC
    `;

    const topCollections = await prisma.$queryRawUnsafe(q) as unknown as any[];

    return topCollections.map((collection: any) => {
      return {
        ...collection,
        sold_activity_count: parseInt(collection.sold_activity_count),
        volume: parseFloat(collection.volume),
      }
    })
  })
});
