import * as z from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(3, "Title should be at least 3 characters long"),
   userId: z.string(),
});

export const createProjectInputSchema = z.object({
    title: z.string().min(3, "Title should be at least")
})
export const getOneProjectSchema = z.object({
    id:z.string().optional()
})
export const updateProjectSchema = z.object({
    id:z.string().or(z.array(z.string())),
    content:z.string(),

})
export const assignUserToProjectSchema=z.object({
    email:z.string().email(),
    projectId:z.string()
})

export const getAssignedProjectSchema=z.object({
    projectId:z.string(),
    userId:z.string()
})

export const changeColaboratorStatusSchema=getAssignedProjectSchema.extend({
    status:z.enum(['PENDING','ACCEPTED','REJECTED']),
})
export const changeStatus=z.object({
    projectId:z.string(),
    status:z.enum(['PENDING','ACCEPTED','REJECTED']),
})
export const getAssignedProjectByStatusSchema=z.object({
    userId:z.string().optional(),
    status:z.enum(['PENDING','ACCEPTED','REJECTED']),

})

export type IGetOneProjectSchema = z.infer<typeof getOneProjectSchema>
export type ICreateProject = z.infer<typeof createProjectSchema>;
export type ICreateProjectInput = z.infer<typeof createProjectInputSchema>
export type TUpdatedProject = z.infer<typeof updateProjectSchema>
export type TAssignUserToProject = z.infer<typeof assignUserToProjectSchema>
export type TGetAssignedProjects = z.infer<typeof getAssignedProjectSchema>
export type TGetAssignedProjectsByStatus = z.infer<typeof getAssignedProjectByStatusSchema>
export type TChangeStatus=z.infer<typeof changeColaboratorStatusSchema>

export type TChangeStatus2=z.infer<typeof changeStatus>
