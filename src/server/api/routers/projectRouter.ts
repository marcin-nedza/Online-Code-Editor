import {
    assignUserToProjectSchema, changeColaboratorStatusSchema, createProjectInputSchema, getAssignedProjectByStatusSchema, getOneProjectSchema, updateProjectSchema
} from "../../../schemas/project";
import {
    assignUserToProjectHandler,
    changeProjectStatusHandler,
    createProjectHandler,
    getAllAssignedProjectsHandler,
    getAllProjectHandler,
    getOneProjectHandler,
    updateProjectHandler
} from "../../controllers/project.controller";
import { createTRPCRouter, publicProcedure } from "../trpc";

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
    .mutation(({input})=>assignUserToProjectHandler({email:input.email,projectId:input.projectId})),

    getAssignedProjectByStatus:publicProcedure
    .input(getAssignedProjectByStatusSchema)
    .mutation(({input,ctx})=>getAllAssignedProjectsHandler({status:input.status,userId:ctx.user?.id as string})),

    changeStatus:publicProcedure
    .input(changeColaboratorStatusSchema)
    .mutation(({input,ctx})=>changeProjectStatusHandler({projectId:input.projectId,status:input.status,userId:ctx.user!.id}))

});
