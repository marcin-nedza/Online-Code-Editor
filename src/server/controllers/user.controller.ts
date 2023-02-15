import {TRPCError} from '@trpc/server'
import {Context} from '../api/trpc'
export const getMeHandler=({ctx}:{ctx:Context})=>{
    try {
       const user = ctx.user 
        return {
            status:'success',
            data:{
                user
            }
        }
    } catch (error:any) {
       throw new TRPCError({
            code:"INTERNAL_SERVER_ERROR",
            message:error.message
        }) 
    }
}
export const findUserHandler=async({ctx,}:{ctx:Context})=>{
    try {
       const user=await ctx.prisma.user.findUnique() 
    } catch (error) {
        
    }
}
