import { prisma } from "@marketplace/db";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { BigNumberish } from "ethers/utils";
import { convertBigNumber } from "./utils";

export type Listing = {
  listingId: BigNumber;
  tokenId: BigNumber;
  price: BigNumberish;
  seller: string;
  nftContract: string;
  active: boolean;
}

export async function createListing(listing: Listing) {
  try {
    const collectionToken = await prisma.collectionToken.findFirst({
      where:
      {
        tokenId: convertBigNumber(listing.tokenId),
        collection: { address: listing.nftContract }
      },
      select: { id: true }
    })
    await prisma.$transaction(async prisma => {
      const activity = await prisma.activity.create({
        data: {
          contractAddress: listing.nftContract,
          seller: listing.seller,
          listingId: convertBigNumber(listing.listingId),
          price: ethers.utils.formatEther(listing.price),
          active: listing.active,
          tokenId: convertBigNumber(listing.tokenId),
          collectionTokenId: collectionToken?.id,
          type: 'LISTING',
        }
      })
      if (collectionToken) {
        await prisma.latestCollectionTokenActivity.upsert({
          create: {
            activityId: activity.id,
            collectionTokenId: collectionToken.id
          },
          update: {
            activityId: activity.id,
          },
          where: {
            collectionTokenId: collectionToken.id
          }
        })
      }
    })

  } catch (err) {

  }
}


export const updateListingPrice = async (listingId: BigNumber, price: BigNumberish) => {
  try {
    await prisma.activity.update({
      where: {
        listingId_type: {
          listingId: convertBigNumber(listingId),
          type: "LISTING",
        }
      },
      data: {
        price: ethers.utils.formatEther(price),
      }
    })
  } catch (error) {

  }
}



export const cancelListing = async (listingId: BigNumber) => {
  try {
    const listing = await prisma.activity.findUnique({
      where: {
        listingId_type: {
          listingId: convertBigNumber(listingId),
          type: "LISTING",
        }
      }
    })

    if (listing) {
      const { id, createdAt, updatedAt, ..._listing } = listing
      await prisma.$transaction(async prisma => {
        await prisma.activity.update({
          data: {
            active: false
          },
          where: {
            id: listing.id
          }
        })
        const activity = await prisma.activity.create({
          data: {
            ..._listing,
            active: false,
            type: 'WITHDRAW'
          }
        })

        if (listing.collectionTokenId) {
          await prisma.latestCollectionTokenActivity.upsert({
            create: {
              activityId: activity.id,
              collectionTokenId: listing.collectionTokenId
            },
            update: {
              activityId: activity.id,
            },
            where: {
              collectionTokenId: listing.collectionTokenId
            }
          })
        }
      })

    }
  } catch (error: any) {
    console.log('error cancelListing:', error.message);
  }
}



export const createSold = async (args: Pick<Listing, 'seller' | 'price' | 'tokenId' | 'nftContract'> & { buyer: string }) => {
  try {
    const collectionToken = await prisma.collectionToken.findFirst({
      where: {
        tokenId: convertBigNumber(args.tokenId),
        collection: { address: args.nftContract }
      }, select: { id: true }
    })


    await prisma.$transaction(async prisma => {
      const activity = await prisma.activity.create({
        data: {
          contractAddress: args.nftContract,
          seller: args.seller,
          buyer: args.buyer,
          price: ethers.utils.formatEther(args.price),
          tokenId: convertBigNumber(args.tokenId),
          collectionTokenId: collectionToken?.id,
          type: 'SOLD',
          notification: {
            create: {}
          }
        }
      })
      if (collectionToken) {
        await prisma.latestCollectionTokenActivity.upsert({
          create: {
            activityId: activity.id,
            collectionTokenId: collectionToken.id
          },
          update: {
            activityId: activity.id,
          },
          where: {
            collectionTokenId: collectionToken.id
          }
        })
      }
    })
  } catch (error) {

  }
}