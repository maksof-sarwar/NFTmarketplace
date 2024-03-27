import { contract } from './src/lib/ether'
import { prisma } from '@marketplace/db'
import { convertBigNumber } from './src/lib/utils';
import { ethers } from 'ethers';
const run = async () => {
  const listings = await contract.getAllListings() as any[]
  const a = listings.filter(l => l.nftContract === '0x7146b9eD956D091f833DE7dF39e6f09f71685353').filter(a => a.active)
    .map(a => {
      a.listingId = a.listingId.toNumber()
      a.price = ethers.utils.formatEther(convertBigNumber(a.price))
      return a;
    })

  console.log(a);
  // const listings = await prisma.activity.findMany();
  // for (const listing of listings) {
  //   if (listing.collectionTokenId) {
  //     await prisma.latestCollectionTokenActivity.upsert({
  //       create: {
  //         activityId: listing.id,
  //         collectionTokenId: listing.collectionTokenId
  //       },
  //       update: {
  //         activityId: listing.id
  //       },
  //       where: {
  //         collectionTokenId: listing.collectionTokenId
  //       }
  //     })
  //   }
  // }
  // const listings = await contract.getAllListings() as any[];
  // for (const listing of listings) {
  //   const collectionTokenId = await prisma.collectionToken.findFirst({
  //     where: {
  //       tokenId: convertBigNumber(listing.tokenId), collection: {
  //         address: listing.nftContract
  //       }
  //     }, select: { id: true }
  //   })
  //   await prisma.activity.create({
  //     data: {
  //       contractAddress: listing.nftContract,
  //       seller: listing.seller,
  //       type: listing.active ? 'LISTING' : "WITHDRAW",
  //       listingId: convertBigNumber(listing.listingId),
  //       price: ethers.utils.formatEther(listing.price),
  //       active: listing.active,
  //       tokenId: convertBigNumber(listing.tokenId),
  //       collectionTokenId: collectionTokenId?.id,
  //     }
  //   })
  // }

}
run().catch(err => {
  console.log(err);
}).finally(() => {
  process.exit(0);
})