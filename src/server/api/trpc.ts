import {  CreateNextContextOptions } from "@trpc/server/adapters/next";

import { prisma } from "../db";
export const createTRPCContext = async (opts: CreateNextContextOptions&{user?:User}) => {
  const { req, res } = opts;
  // Get the session from the server using the unstable_getServerSession wrapper function
  // const session = await getServerAuthSession({ req, res });
   const token = Object.values(req.cookies)[0]
    let user:User | null
    if(token && token.length>0) {
         user = decodeJwt(token).sub
    }else{
        user=null
    }
    
//TODO: Add user from req.headers.authorization
    return {
        // session,
        req,
        res,
        prisma,
        user
    }
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import {User} from "@prisma/client";
import {decodeJwt, jwtVerify} from "jose";

export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});
export type Context = inferAsyncReturnType<typeof createTRPCContext>;
/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure
 */
 const isAuthed2=t.middleware(({next,ctx})=>{
    if(!ctx.user) {
       throw new Error('Not authorized') 
        console.log('BLAD')
     
    }
    return next()
})
/**

 * Protected (authed) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees ctx.session.user is not
 * null
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(isAuthed2);
