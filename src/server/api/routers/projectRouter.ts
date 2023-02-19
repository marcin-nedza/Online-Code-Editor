import {
    assignUserToProjectSchema,
    createProjectInputSchema, getOneProjectSchema,updateProjectSchema
} from "../../../schemas/project";
import {
    assignUserToProjectHandler,
    createProjectHandler,
    getAllProjectHandler,
    getOneProjectHandler,
    updateProjectHandler
} from "../../controllers/project.controller";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({

  createProject: publicProcedure
    .input(createProjectInputSchema)
    .mutation(({ input, ctx }) => createProjectHandler({ input, ctx })),

  getAllProject: publicProcedure.query(({ ctx }) =>
    getAllProjectHandler({ ctx })
  ),

  getSingleProject: publicProcedure
    .input(getOneProjectSchema)
    .mutation(({input }) =>  getOneProjectHandler({input})
  ),
    updateProject:publicProcedure
    .input(updateProjectSchema)
    .mutation(({input})=>updateProjectHandler(input)),

    assignUserToProject:publicProcedure
    .input(assignUserToProjectSchema)
    .mutation(({input})=>assignUserToProjectHandler({email:input.email,projectId:input.projectId}))

});
