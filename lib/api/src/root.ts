
import { collectionRouter } from "./router/collection";
import { collectionTokenRouter } from "./router/collection-token";
import { leaderboardRouter } from "./router/leaderboard";
import { userProfileRouter } from "./router/user-profile";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  userProfile: userProfileRouter,
  collection: collectionRouter,
  collectionToken: collectionTokenRouter,
  leaderboard: leaderboardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
