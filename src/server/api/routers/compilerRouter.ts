import { codeSchema, cosik, file2Schema, fileSchema } from "../../../schemas/code";
import { runCode, runCodeController } from "../../controllers/compiler.controller";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const compilerRouter=createTRPCRouter({
    writeFileAndRun:publicProcedure
    .input(file2Schema)
    .mutation(({input})=>runCode({files:input.files,current:input.current}))
})
