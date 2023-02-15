import { createTRPCRouter } from "./trpc";
import {userRouter} from "./routers/userRouter";
import {projectRouter} from "./routers/projectRouter";
import {compilerRouter} from "./routers/compilerRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
    project:projectRouter,
    compiler:compilerRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

