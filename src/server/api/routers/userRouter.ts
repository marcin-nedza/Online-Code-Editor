import {signupSchema,loginSchema} from "../../../schemas/auth";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {loginHandler, logoutHandler, registerHandler } from "../../controllers/auth.controller";
import {getMeHandler} from "../../controllers/user.controller";

export const userRouter = createTRPCRouter({
//create user
    registerUser: publicProcedure
    .input(signupSchema)
    .mutation(({input})=>registerHandler({input})),
    getMe:publicProcedure
    .query(({ctx})=>getMeHandler({ctx})),
    loginUser: publicProcedure
    .input(loginSchema)
    .mutation(({input,ctx})=>loginHandler({input,ctx})),
    logout:publicProcedure
    .mutation(({ctx})=>logoutHandler({ctx}))
   });
