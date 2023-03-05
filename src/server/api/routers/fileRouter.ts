import {createFileSchema,getOneFileSchema, updateFileSchema} from "../../../schemas/file";
import {createFileHandler,getSingleFileHandler, updateFileHandler} from "../../controllers/file.controller";
import {createTRPCRouter, publicProcedure} from "../trpc";


export const fileRouter = createTRPCRouter({

  createFile: publicProcedure
    .input(createFileSchema)
    .mutation(({ input }) => createFileHandler({ input })),
getSingleFile:publicProcedure
    .input(getOneFileSchema)
    .mutation(({input})=>getSingleFileHandler({input})),
    saveFile:publicProcedure
    .input(updateFileSchema)
    .mutation(({input})=> updateFileHandler(input))
})
