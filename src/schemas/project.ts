import * as z from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(3, "Title should be at least 3 characters long"),
   userId: z.string(),
});

export const createProjectInputSchema = z.object({
    title: z.string().min(3, "Title should be at least")
})
export const getOneProjectSchema = z.object({
    id:z.string()
})
export const updateProjectSchema = z.object({
    id:z.string().or(z.array(z.string())),
    content:z.string(),

})
export const assignUserToProjectSchema=z.object({
    email:z.string().email(),
    projectId:z.string()
})

export type IGetOneProjectSchema = z.infer<typeof getOneProjectSchema>
export type ICreateProject = z.infer<typeof createProjectSchema>;
export type ICreateProjectInput = z.infer<typeof createProjectInputSchema>
export type TUpdatedProject = z.infer<typeof updateProjectSchema>
export type TAssignUserToProject = z.infer<typeof assignUserToProjectSchema>
