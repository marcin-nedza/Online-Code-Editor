import {z} from "zod";

export const usersSchema=z.object({
socketId:z.string(),
    // username:z.string(),
    userId:z.string()
})

export const userDataConnect=z.object({
    username:z.string(),
    userId:z.string(),
    projectId:z.string().or(z.array(z.string())),
})

export const viewState=z.object({
    len:z.number(),
    text:z.string(),
    fileId:z.string().or(z.array(z.string())),
}) 

export const socketData=z.object({
   pos:z.number(),
    fileId:z.string(),
    userId:z.string(),
    username:z.string(),
})
export type TUsers=z.infer<typeof usersSchema>
export type TUserConnectData=z.infer<typeof userDataConnect>
export type TViewState=z.infer<typeof viewState>
export type TSocketData=z.infer<typeof socketData>
