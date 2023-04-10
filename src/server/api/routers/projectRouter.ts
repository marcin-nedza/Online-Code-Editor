import {
  assignUserToProjectSchema,
  changeColaboratorStatusSchema,
  changeStatus,
  createProjectInputSchema,
  getAssignedProjectByStatusSchema,
  getAssignedProjectSchema,
  getOneProjectSchema,
  updateProjectSchema,
} from "../../../schemas/project";
import {
  assignUserToProjectHandler,
  changeProjectStatusHandler,
  createProjectHandler,
  deleteColaboration,
  getAllAssignedProjectsHandler,
  getAllProjectHandler,
  getOneProjectHandler,
  updateProjectHandler,
} from "../../controllers/project.controller";
import { createTRPCRouter, publicProcedure,protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  createProject: publicProcedure
    .input(createProjectInputSchema)
    .mutation(({ input, ctx }) => createProjectHandler({ input, ctx })),

  getAllProject: publicProcedure.query(({ ctx }) =>
    getAllProjectHandler({ ctx })
  ),
getProjectQuery:protectedProcedure
    .input(getOneProjectSchema)
    .query(({input,ctx})=>getOneProjectHandler({input,user:ctx.user})),
  getSingleProject: protectedProcedure
    .input(getOneProjectSchema)
    .mutation(({ input }) => getOneProjectHandler({ input })),
  updateProject: publicProcedure
    .input(updateProjectSchema)
    .mutation(({ input }) => updateProjectHandler(input)),

  assignUserToProject: publicProcedure
    .input(assignUserToProjectSchema)
    .mutation(({ input, ctx }) => {
      if (!ctx.user) {
        return;
      }
      return assignUserToProjectHandler({
        email: input.email,
        projectId: input.projectId,
      });
    }),

  getAssignedProjectByStatus: publicProcedure
    .input(getAssignedProjectByStatusSchema)
    .mutation(({ input, ctx }) =>
      getAllAssignedProjectsHandler({
        status: input.status,
        userId: ctx.user?.id as string,
      })
    ),

  changeStatus: publicProcedure
    .input(changeStatus)
    .mutation(({ input, ctx }) =>{
      return changeProjectStatusHandler({
        projectId: input.projectId,
        status: input.status,
            userId:ctx.user?.id as string
      })
    }
    ),

    deleteColaboration:publicProcedure
    .input(getAssignedProjectSchema)
    .mutation(({input})=>deleteColaboration(input))
});
