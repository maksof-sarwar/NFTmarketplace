import { access } from "fs";
import { PrismaClient } from "./prisma-client";
import { TopCollection } from "./lib/api/src/types";

export const prisma =
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // log:
    // 	process.env.NODE_ENV === 'development'
    // 		? ['query', 'error', 'warn']
    // 		: ['error'],
  });

// const d = await prisma.$queryRaw`
// SELECT *
// FROM tbl_collection_token
// WHERE EXISTS (
//   SELECT 1
//   FROM jsonb_array_elements(tbl_collection_token.attributes) AS element
//   WHERE element->>'trait_type' = 'Background'
// )
// `
// console.log(d);
// const tokenId = ''
// const address = '0x7C7FBB934FB96b2355DcA0e14Ad178DF24a6461f'
// const aution: "LISTING" | "WITHDRAW" | undefined = undefined;
// const price: { min?: string; max?: string } = {}
// const rank: { min?: string; max?: string } = {}
// const traits: Array<{ trait_type: string, value: string }> = []
// let query = `
//   select tct.*, ta.price , ta.active, ta."listingId" , ta.seller from tbl_collection_token tct
//   left join  tbl_collection tc on tc.id = tct.collection_id
//   left join  tbl_latest_collection_token_activity tlcta on tct.id = tlcta.collection_token_id
//   left join  tbl_activity ta on ta.id = tlcta.activity_id
//   CROSS JOIN LATERAL json_array_elements(to_json(tct."attributes")) AS _traits
//   where 1=1 and  tc.address = '${address}'
// `
// if (tokenId) {
//   query += ` and tct.token_id = '${tokenId}'`
// }
// if (aution) {
//   query += ` and ta.type = '${aution}'`
// }
// if (price) {
//   if (price.min) {
//     query += ` and ta.price::float <= ${price.min}`
//   }
//   if (price.max) {
//     query += ` and ta.price::float >= ${price.max}`
//   }
// }
// if (rank) {
//   if (rank.min) {
//     query += ` and (tct.rarity->>'rank')::int <= ${rank.min}`
//   }
//   if (rank.max) {
//     query += ` and (tct.rarity->>'rank')::int >= ${rank.max}`
//   }
// }
// if (traits.length > 0) {
//   query += traits.map(trait => `and _traits->>'trait_type' like '%${trait.trait_type}%' and  _traits->>'value' like '%${trait.value}%'`).join(' ')
// }

// query += ` ORDER BY CASE WHEN ta.type = 'LISTING' THEN 0 ELSE 1 END, ta.price::float`
// console.log(query);
// const collectionToken = await prisma.$queryRawUnsafe(`SELECT  DISTINCT  * FROM (${query}) as subquery`)


// console.log(collectionToken);

// const address = '0x4b8619c321EfB7792972Be4Fc0BA1D6d5cC9Ab60'
// const name = 'swoop'
// let q = `SELECT tc.* , tm.url as banner, tmm.url as logo  FROM tbl_collection tc left join tbl_media tm on tm.id = tc.banner left join tbl_media tmm on tmm.id = tc.logo where 1=1`;

// // if (address) {
// //   q += ` and tc.address = '${address}'`
// // }
// if (name) {
//   q += ` and tc.metadata->>'name' ilike '%${name}%'`
// }

// q += ` LIMIT 10`

// const data = await prisma.$queryRawUnsafe(q);
// console.log(data);


// async function getTopBuyers() {
//   const topBuyers = await prisma.activity.groupBy({
//     by: ['buyer'],
//     where: {
//       type: 'SOLD',
//     },
//     _count: {
//       buyer: true,
//     },
//     orderBy: {
//       _count: {
//         buyer: 'desc',
//       },
//     },
//     take: 10,
//   });

//   return topBuyers.map(({ buyer, _count }) => ({
//     buyer,
//     buyCount: _count.buyer,
//   }));
// }

// // Usage example
// async function main() {
//   try {
//     const topBuyers = await getTopBuyers();
//     console.log('Top 10 buyers with most sold records:', topBuyers);
//   } catch (error) {
//     console.error('Error fetching top buyers:', error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main();



// const topCollections = await prisma.$queryRaw`
//   SELECT c.id, c.metadata->>'name' as name, COUNT(a.id) as sold_activity_count
//   FROM tbl_collection c
//   LEFT JOIN tbl_collection_token ct ON c.id = ct.collection_id
//   LEFT JOIN tbl_activity a ON ct.id = a.collection_token_id
//   WHERE a.type = 'SOLD'
//   GROUP BY c.id
//   ORDER BY sold_activity_count DESC
//   LIMIT 10;
// `;
// export const duration = ['1H', '6H', '24H', '7D', '30D', ''] as const
// export type Duration = typeof duration[number]
// export async function getTopCollectionsWithSoldActivityCount(duration: Duration = '') {
//   let dateCondition = '';
//   switch (duration) {
//     case '1H':
//       dateCondition = '1 HOUR';
//       break;
//     case '6H':
//       dateCondition = '6 HOURS';
//       break;
//     case '24H':
//       dateCondition = '24 HOURS';
//       break;
//     case '7D':
//       dateCondition = '7 DAYS';
//       break;
//     case '30D':
//       dateCondition = '30 DAYS';
//       break;
//     default:
//       break;
//   }
//   let dateFilter = '';
//   if (dateCondition !== '') {
//     dateFilter = `AND ta.created_at >= NOW() - INTERVAL '${dateCondition}'`;
//   }
//   try {
//     const topCollections = await prisma.$queryRawUnsafe(`
//     SELECT tc.id, tc.metadata->>'name' as name, COALESCE(COUNT(ta.id), 0) as sold_activity_count
//     FROM tbl_collection tc
//     LEFT JOIN tbl_activity ta ON tc.address = ta.contract_address ${dateFilter} AND ta.type = 'SOLD'
//     GROUP BY tc.id
//     ORDER BY sold_activity_count DESC;
//   ` ) as unknown as any[];

//     return topCollections.map((collection: any) => ({
//       ...collection,
//       sold_activity_count: parseInt(collection.sold_activity_count)
//     }));
//   } catch (error) {
//     console.error(`Error fetching top collections with sold activity count for ${duration}:`, error);
//     throw error;
//   } finally {
//     await prisma.$disconnect();
//   }
// }


// // console.log(await getTopCollectionsWithSoldActivityCount());



// async function findLowestPriceWithLatestActivity() {
//   const query = `
//     SELECT COALESCE(CAST(MIN(a.price) AS TEXT), '0') as floor, tc.id
//     FROM tbl_activity AS a
//     LEFT JOIN tbl_collection tc on tc.address = a.contract_address
//     JOIN tbl_latest_collection_token_activity AS lcta
//     ON a.id = lcta.activity_id
//     WHERE a.type = 'LISTING' OR a.type IS NULL
//     GROUP BY tc.id
//   `;
//   const result = await prisma.$queryRawUnsafe(query) as unknown as any[];
//   return result
// }


// console.log(await findLowestPriceWithLatestActivity());



// const data = await prisma.$queryRawUnsafe(`
// SELECT tc.id, tc.metadata as metadata, tc.address, tc.slug, COALESCE(COUNT(ta.id), 0) as sold_activity_count
// FROM tbl_collection tc
// LEFT JOIN tbl_activity ta ON tc.address = ta.contract_address AND ta.created_at >= NOW() - INTERVAL '24 HOURS' AND ta.type = 'SOLD'
// GROUP BY tc.id
// ORDER BY sold_activity_count DESC
// LIMIT 2`)


// console.log(data);




// const [collections, floorPrices] = await Promise.all([
//   collectionUtils.getTopCollectionsWithSoldActivityCount(''),
//   collectionUtils.findLowestPriceWithLatestActivity()
// ])
// const withMediaUrl = collections.map((collection) => ({
//   ...collection,
//   banner: getMediaUrl(collection.id, 'bannerMedia'),
//   logo: getMediaUrl(collection.id, 'logoMedia')
// }))
// const d = await Promise.all<TopCollection>(
//   collections.map(async (collection, idx) => ({
//     ...collection,
//     rank: idx + 1,
//     floorPrice: floorPrices.find((item: any) => item.id === collection.id)?.floor || '0',
//     logo: await getMediaUrl(collection.id, 'logoMedia'),
//     banner: await getMediaUrl(collection.id, 'bannerMedia')
//   }))
// ).then(collections => {
//   const sortedCollections = collections.sort((a, b) => parseFloat(b.sold_activity_count) - parseFloat(a.sold_activity_count))
//   return sortedCollections
// })



export const duration = ['1H', '6H', '24H', '7D', '30D', ''] as const
export type Duration = typeof duration[number]
export async function getTopCollectionsWithSoldActivityCount(duration: Duration = '', take?: number) {
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
    dateFilter = `AND ta.created_at >= NOW() - INTERVAL '${dateCondition}'`;
  }
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
      LEFT JOIN tbl_activity ta ON tc.address = ta.contract_address ${dateFilter} AND ta.type = 'SOLD'
      GROUP BY tc.id, m1.url, m2.url
      ORDER BY sold_activity_count DESC
    `;
    if (take) {
      q += ` LIMIT ${take}`
    }
    const topCollections = await prisma.$queryRawUnsafe(q) as unknown as any[];

    return topCollections.map((collection: any) => ({
      ...collection,
      sold_activity_count: parseInt(collection.sold_activity_count),
      volume: parseFloat(collection.volume),
    }));
  } catch (error) {
    console.error(`Error fetching top collections with sold activity count for ${duration}:`, error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
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


// console.time('test');
// const [collections, floorPrices] = await Promise.all([
//   getTopCollectionsWithSoldActivityCount(''),
//   findLowestPriceWithLatestActivity()
// ])

// const d = await Promise.all<TopCollection>(
//   collections.map(async (collection, idx) => ({
//     ...collection,
//     rank: idx + 1,
//     floorPrice: floorPrices.find((item: any) => item.id === collection.id)?.floor || '0',
//     // logo: await getMediaUrl(collection.id, 'logoMedia'),
//     // banner: await getMediaUrl(collection.id, 'bannerMedia')
//   }))
// )

// // console.log(d);
// console.timeEnd('test');
// export async function getPriceChanges(contractAddress: string, duration: Duration = '') {
//   let dateFilter = '';
//   if (duration === '') {
//     // If duration is empty, consider records from the time of the first activity occurrence
//     const earliestActivityQuery = `
//       SELECT MIN(created_at) as earliest_activity
//       FROM tbl_activity
//       WHERE type = 'SOLD'
//     `;
//     const earliestActivityResult = await prisma.$queryRawUnsafe(earliestActivityQuery) as unknown as any[]
//     const earliestActivity = earliestActivityResult?.[0]?.earliest_activity;
//     if (earliestActivity) {
//       dateFilter = `AND created_at >= '${earliestActivity.toISOString()}}'`;
//     }
//   } else {
//     let dateCondition = '';
//     switch (duration) {
//       case '1H':
//         dateCondition = '1 HOUR';
//         break;
//       case '6H':
//         dateCondition = '6 HOURS';
//         break;
//       case '24H':
//         dateCondition = '24 HOURS';
//         break;
//       case '7D':
//         dateCondition = '7 DAYS';
//         break;
//       case '30D':
//         dateCondition = '30 DAYS';
//         break;
//       default:
//         // Default to 24 hours if no valid duration is provided
//         dateCondition = '24 HOURS';
//         break;
//     }
//     dateFilter = `AND created_at >= NOW() - INTERVAL '${dateCondition}'`;
//   }
//   try {
//     const q = `
//     WITH interval_activity AS (
//       SELECT
//         contract_address as collection_id,
//         price::numeric as price,
//         created_at,
//         ROW_NUMBER() OVER (PARTITION BY contract_address ORDER BY created_at ASC) as start_rank,
//         ROW_NUMBER() OVER (PARTITION BY contract_address ORDER BY created_at DESC) as end_rank
//       FROM tbl_activity
//       WHERE type = 'SOLD' and contract_address = '${contractAddress}'
//         ${dateFilter}
//     )
//     SELECT
//       collection_id,
//       MAX(CASE WHEN start_rank = 1 THEN price END) as start_price,
//       MAX(CASE WHEN end_rank = 1 THEN price END) as end_price
//     FROM interval_activity
//     GROUP BY collection_id
//     `;
//     const result = await prisma.$queryRawUnsafe(q);
//     return result;
//   } catch (error) {
//     console.error(`Error calculating price change percentage for ${duration}:`, error);
//     throw error;
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// console.log(await getPriceChanges('0x7146b9eD956D091f833DE7dF39e6f09f71685353'));



export async function findLowestPriceWithLatestActivity(timeframe: string | null = null) {
  let dateCondition = '';
  if (timeframe) {
    switch (timeframe) {
      case '24H':
        dateCondition = "AND a.created_at <= NOW() - INTERVAL '1 day'";
        break;
      case '3D':
        dateCondition = "AND a.created_at <= NOW() - INTERVAL '4 days'";
        break;
      case '7D':
        dateCondition = "AND a.created_at <= NOW() - INTERVAL '7 days'";
        break;
      case '30D':
        dateCondition = "AND a.created_at <= NOW() - INTERVAL '30 days'";
        break;
      default:
        throw new Error('Invalid timeframe');
    }
  }

  const query = `
    SELECT COALESCE(CAST(MIN(a.price) AS TEXT), '0') as floor, tc.id, tc.metadata->>'name' as name ,tc.address
    FROM tbl_activity AS a
    LEFT JOIN tbl_collection tc on tc.address = a.contract_address
    WHERE a.type = 'LISTING' and tc.id is not null
    ${dateCondition}
    GROUP BY tc.id
  `;
  const result = await prisma.$queryRawUnsafe(query);
  return result;
}



const getLeaderboardList = async (duration: Duration) => {
  // Raw SQL query to retrieve leaderboard data with sold count and total sold price
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
    dateFilter = `AND created_at >= NOW() - INTERVAL '${dateCondition}'`;
  }
  const buyerAddressesQuery = `
    SELECT DISTINCT buyer
    FROM tbl_activity
  `;

  const leaderboardQuery = `
    WITH BuyerAddresses AS (
      ${buyerAddressesQuery}
    )
    SELECT
      BuyerAddresses.buyer,
      COALESCE(COUNT(tbl_activity.id), 0) AS buy_count,
      COALESCE(SUM(tbl_activity.price::numeric), 0) AS total_buy_volume,
      ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(tbl_activity.price::numeric), 0) DESC) AS rank
    FROM
      BuyerAddresses
    LEFT JOIN tbl_activity ON BuyerAddresses.buyer = tbl_activity.buyer
        AND tbl_activity.type = 'SOLD'
        ${dateFilter}
    WHERE
        BuyerAddresses.buyer IS NOT NULL
    GROUP BY
      BuyerAddresses.buyer
    ORDER BY
      total_buy_volume  DESC
    LIMIT 10;
  `;

  // Execute raw query
  const leaderboardData = await prisma.$queryRawUnsafe(leaderboardQuery) as unknown as any[];

  // Map the result to add rank
  return leaderboardData.map(({ buy_count, total_buy_volume, ...rest }, idx) => ({
    ...rest,
    buyCount: Number(buy_count),
    volume: Number(total_buy_volume),
  }));
}


const collectionStats = async ({ address, slug }: any) => {
  let q = `
  SELECT 
  tc.id, 
  tc.metadata as metadata, 
  tc.address, 
  tc.slug, 
  m1.url as logo , 
  m2.url as banner, 
  DATE_TRUNC('hour', ta.created_at) as hour,
  COALESCE(COUNT(ta.id), 0) as sold_activity_count,
  COALESCE(SUM(ta.price::numeric), 0) as volume
FROM tbl_collection tc
LEFT JOIN 
  tbl_media m1 ON tc.logo = m1.id
LEFT JOIN 
  tbl_media m2 ON tc.banner = m2.id
LEFT JOIN tbl_activity ta ON tc.address = ta.contract_address   AND ta.type = 'SOLD'
GROUP BY tc.id, m1.url, m2.url, hour
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
}


console.log(await collectionStats({ slug: 'monsta' }));