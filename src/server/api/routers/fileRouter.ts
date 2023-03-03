import {createFileSchema} from "../../../schemas/file";
import {createFileHandler} from "../../controllers/file.controller";
import {createTRPCRouter, publicProcedure} from "../trpc";


export const fileRouter = createTRPCRouter({

  createFile: publicProcedure
    .input(createFileSchema)
    .mutation(({ input }) => createFileHandler({ input })),
})
