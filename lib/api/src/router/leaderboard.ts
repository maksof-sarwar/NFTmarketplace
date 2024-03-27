import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { duration } from "../service/collection";

export const leaderboardRouter = createTRPCRouter({
  getLeaderboardList: publicProcedure
    .input(
      z.object({
        duration: z.enum(duration).default(''),
      })
    )
    .query(async ({ ctx, input }) => {
      let dateCondition = '';
      switch (input.duration) {
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
          COALESCE(SUM(tbl_activity.price::numeric), 0) AS total_buy_volume
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
      const leaderboardData = await ctx.prisma.$queryRawUnsafe(leaderboardQuery) as unknown as any[];

      // Map the result to add rank
      return leaderboardData.map(({ buyer, buy_count, total_buy_volume }, idx) => ({
        rank: idx + 1,
        buyer,
        buyCount: Number(buy_count),
        volume: Number(total_buy_volume),
      }));

    })
})
