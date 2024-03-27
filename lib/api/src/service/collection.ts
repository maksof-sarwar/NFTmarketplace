import { prisma } from "@marketplace/db";
import { TopCollection } from "../types";


export const duration = ['1H', '6H', '24H', '7D', '30D', ''] as const
export type Duration = typeof duration[number]
export async function getTopCollectionsWithSoldActivityCount(duration: Duration = '', take?: number) {
  try {
    let q = `
      SELECT 
        tc.id, 
        tc.metadata as metadata, 
        tc.address, 
        tc.slug, 
        m1.url as logo , 
        m2.url as banner, 
        COALESCE(COUNT(ta.id), 0) as sold_activity_count,
        COALESCE(SUM(ta.price::numeric), 0) as volume
      FROM tbl_collection tc
      LEFT JOIN 
        tbl_media m1 ON tc.logo = m1.id
      LEFT JOIN 
        tbl_media m2 ON tc.banner = m2.id
      LEFT JOIN tbl_activity ta ON tc.address = ta.contract_address  ${getSqlDuration(duration, true)} AND ta.type = 'SOLD'
      GROUP BY tc.id, m1.url, m2.url
      ORDER BY sold_activity_count DESC
    `;
    if (take) {
      q += ` LIMIT ${take}`
    }
    const topCollections = await prisma.$queryRawUnsafe(q) as unknown as any[];

    return topCollections.map((collection: any) => {
      return {
        ...collection,
        sold_activity_count: parseInt(collection.sold_activity_count),
        volume: parseFloat(collection.volume),
      }
    })

  } catch (error) {
    console.error(`Error fetching top collections with sold activity count for ${duration}:`, error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}



export async function findLowestPriceWithLatestActivity(duration: Duration) {
  const query = `
    SELECT COALESCE(CAST(MIN(ta.price) AS TEXT), '0') as floor, tc.id, tc.metadata->>'name' as name
    FROM tbl_activity AS ta
    LEFT JOIN tbl_collection tc on tc.address = ta.contract_address
    WHERE ta.type = 'LISTING' and ta.active = true and tc.id is not null
    ${getSqlDuration(duration)}
    GROUP BY tc.id
  `;
  const result = await prisma.$queryRawUnsafe(query) as unknown as any[];
  return result;
}

function getSqlDuration(duration: Duration, gte?: boolean) {
  let dateCondition = '';
  switch (duration) {
    case '1H':
      dateCondition = '1 HOUR';
      break;
    case '6H':
      dateCondition = '6 HOURS';
      break;
    case '24H':
      dateCondition = '24 HOURS';
      break;
    case '7D':
      dateCondition = '7 DAYS';
      break;
    case '30D':
      dateCondition = '30 DAYS';
      break;
    default:
      break;
  }
  let dateFilter = '';
  if (dateCondition !== '') {
    dateFilter = `AND ta.created_at ${gte ? '>=' : '<='} NOW() - INTERVAL '${dateCondition}'`;
  }


  return dateFilter
}

export const getMediaUrl = async (collectionId: string, type: "bannerMedia" | "logoMedia") => {
  return prisma.collection.findUnique({
    where: { id: collectionId }, select: {
      [type]: {
        select: {
          url: true
        }
      }
    }
  }).then((collection: any) => collection?.[type]?.url)
}


export const getCollectionStats = async (slug: string) => {
  let q = `
  SELECT 
    tc.id, 
    tc.metadata as metadata, 
    tc.address, 
    tc.slug, 
    tc.traits,
    m1.url as logo , 
    m2.url as banner, 
    COALESCE(COUNT(CASE WHEN ta.created_at >= NOW() - INTERVAL '24 HOURS' THEN ta.id END), 0) as sold_activity_count_24h,
    COALESCE(SUM(CASE WHEN ta.created_at >= NOW() - INTERVAL '24 HOURS' THEN ta.price::numeric END), 0) as volume_24h,
    COALESCE(COUNT(ta.id), 0) as sold_activity_count,
    COALESCE(SUM(ta.price::numeric), 0) as volume
  FROM tbl_collection tc
  LEFT JOIN 
    tbl_media m1 ON tc.logo = m1.id
  LEFT JOIN 
    tbl_media m2 ON tc.banner = m2.id
  LEFT JOIN tbl_activity ta ON tc.address = ta.contract_address   AND ta.type = 'SOLD'
  WHERE 1=1  AND tc.slug = '${slug}'
  GROUP BY tc.id, m1.url, m2.url
`;

  const _collections = await prisma.$queryRawUnsafe(q) as unknown as any[];
  if (_collections && _collections.length > 0) {
    const floorPrices = await findLowestPriceWithLatestActivity('')
    const collection = _collections[0]
    return {
      ...collection,
      sold_activity_count_24h: parseInt(collection.sold_activity_count_24h),
      volume_24h: parseFloat(collection.volume_24h),
      sold_activity_count: parseInt(collection.sold_activity_count),
      volume: parseFloat(collection.volume),
      floorPrice: floorPrices.find((item: any) => item.id === collection.id)?.floor ?? '0'
    } as TopCollection & { sold_activity_count_24h: number; volume_24h: number }
  }
  return null
}



