import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { ethers } from 'ethers'
import { mediaSchema } from "../schema";
import { prisma } from "@marketplace/db";
const provider = new ethers.providers.JsonRpcProvider(
  'https://test-rpc.vitruveo.xyz'
);
const abi = [
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "_tokenId", "type": "uint256" }],
    "name": "tokenURI",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_index", "type": "uint256" }],
    "name": "tokenOfOwnerByIndex",
    "outputs": [{ "name": "tokenId", "type": "uint256" }],
    "type": "function"
  }
]
export const userProfileRouter = createTRPCRouter({

  getTotalCollection: publicProcedure
    .query(({ ctx, input }) => {
      return ctx.prisma.collection.findMany({
        select: {
          address: true,
          metadata: true
        }
      })
    }),

  getUserProfileImage: publicProcedure.input(z.object({
    userAddress: z.string(),
  })).query(({ ctx, input }) => {
    return ctx.prisma.userProfile.findUnique({
      where: {
        userAddress: input.userAddress
      },
      select: {
        image: true
      }
    })
  }),

  updateUserProfileImage: publicProcedure.input(z.object({
    userAddress: z.string(),
    image: mediaSchema
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.userProfile.upsert({
      create: {
        userAddress: input.userAddress,
        image: {
          create: {
            url: input.image.url,
            path: input.image.path,
          }
        }
      },
      update: {
        image: {
          create: {
            url: input.image.url,
            path: input.image.path,
          }
        }
      },
      where: {
        userAddress: input.userAddress
      }
    })
  }),
  getUserNfts: publicProcedure
    .input(z.object({
      userAddress: z.string(),
      collectionAddress: z.string().optional(),
    })).query(async ({ ctx, input }) => {
      const collections = await ctx.prisma.collection.findMany({
        select: {
          address: true
        },
        where: {
          address: input.collectionAddress
        }
      })
      const userNfts = await Promise.all(
        collections.map(async collection => {
          const promises: any[] = []
          const contract = new ethers.Contract(collection.address, abi, provider);
          const numNFTs = await contract.balanceOf(input.userAddress);
          for (let i = 0; i < numNFTs; i++) {
            promises.push(
              contract.tokenOfOwnerByIndex(input.userAddress, i)
            )
          }
          return Promise.all(promises).then(tokenIds => ({
            collection: collection.address,
            tokenIds: tokenIds.map(tokenId => tokenId.toNumber())
          }))
        })
      )
      return Promise.all(
        userNfts.flatMap(nft => {
          return ctx.prisma.collectionToken.findMany({
            where: {
              collection: {
                address: nft.collection
              },
              tokenId: {
                in: nft.tokenIds.map(tokenId => tokenId.toString())
              }
            },
            select: {
              image: true,
              tokenId: true,
              collectionId: true,
              createdAt: true,
              updatedAt: true,
              metadata: true,
              id: true,
              name: true,
              rarity: true,
              collection: {
                select: {
                  address: true,
                  metadata: true
                }
              },
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
      )
    }),

  getUserActivity: publicProcedure
    .input(z.object({
      userAddress: z.string(),
      take: z.number().default(10),
      skip: z.number().default(0),
    })).query(async ({ ctx, input }) => {
      const activities = await ctx.prisma.activity.findMany({
        where: {
          seller: input.userAddress,
        },
        include: {
          collectionToken: true,
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: input.take,
        skip: input.skip
      })
      const count = await ctx.prisma.activity.count({
        where: {
          seller: input.userAddress,
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return { count, activities }
    }),
  getUserNotification: publicProcedure
    .input(z.object({
      userAddress: z.string().optional(),
    })).query(({ ctx, input }) => {
      if (!input.userAddress) {
        return []
      }
      return ctx.prisma.notification.findMany({
        where: {
          activity: {
            seller: input.userAddress
          },
          seen: false
        },
        include: {
          activity: {
            select: {
              seller: true,
              price: true,
              createdAt: true,
              contractAddress: true,
              tokenId: true,
              collectionToken: {
                select: {
                  image: true,
                  name: true,
                }
              }
            }
          }
        }
      })
    }),

  markNotificationAsSeen: publicProcedure
    .input(z.object({
      notificationIds: z.array(z.string())
    })).mutation(({ ctx, input }) => {
      return ctx.prisma.notification.updateMany({
        data: {
          seen: true,
        },
        where: {
          id: {
            in: input.notificationIds
          }
        }
      })
    })
});
