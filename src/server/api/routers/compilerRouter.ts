import {codeSchema} from "../../../schemas/code";
import {runCodeController} from "../../controllers/compiler.controller";
import {createTRPCRouter, publicProcedure} from "../trpc";

export const compilerRouter=createTRPCRouter({
    runCode:publicProcedure
    .input(codeSchema)
    .mutation(({input})=>runCodeController(input))
})
