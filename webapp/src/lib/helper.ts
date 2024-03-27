import { CollectionMetadata } from "@/types";
import { RouterOutputs } from "@marketplace/api";
import { isDateGreaterThanIntervalAgo } from "./utils";


type Collections = Omit<RouterOutputs['collection']['top10Collection'], 'metadata'> & { metadata: any }

export const formatCollection = (collections: Collections) => {
  return collections.map(collection => {
    const metadata = collection.metadata as unknown as CollectionMetadata
    const collectionTokens = collection.collectionTokens;
    const tokens = collectionTokens
      .map((tokens) => tokens.latestActivity?.activity)
      ?.filter((f) => f?.active)
      ?.map((f) => Number(f?.price || 0))
    const floorPrice = tokens.length === 0 ? 0 : Math.min(
      ...tokens
    )
    const totalVolume = collectionTokens.reduce((p, c) => p + c.activity.filter(f => f.type === 'SOLD').length, 0)
    const last1Hvolume = collectionTokens.reduce((p, c) => p + c.activity.filter(a => isDateGreaterThanIntervalAgo(a.createdAt, 1)).filter(f => f.type === 'SOLD').length, 0)
    const last24Hvolume = collectionTokens.reduce((p, c) => p + c.activity.filter(a => isDateGreaterThanIntervalAgo(a.createdAt, 24)).filter(f => f.type === 'SOLD').length, 0)
    const last7Dvolume = collectionTokens.reduce((p, c) => p + c.activity.filter(a => isDateGreaterThanIntervalAgo(a.createdAt, 24 * 7)).filter(f => f.type === 'SOLD').length, 0)
    const last30Dvolume = collectionTokens.reduce((p, c) => p + c.activity.filter(a => isDateGreaterThanIntervalAgo(a.createdAt, 24 * 30)).filter(f => f.type === 'SOLD').length, 0)
    return {
      "24hVolume": last24Hvolume,
      "1hVolume": last1Hvolume,
      "30dVolume": last30Dvolume,
      "7dVolume": last7Dvolume,
      totalVolume,
      address: collection.address,
      banner: collection.bannerMedia.url,
      logo: collection.logoMedia.url,
      floorPrice,
      name: metadata.name,
      slug: collection.slug,
      released: true,
      totalSupply: metadata?.totalSupply,
    }
  })
}