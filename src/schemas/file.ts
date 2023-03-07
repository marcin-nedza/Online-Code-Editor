import * as z from "zod";

export const createFileInputSchema=z.object({
    title: z.string().min(2, "Title should be at least 2 characters long"),

})
export const createFileSchema= createFileInputSchema.extend({
    projectId:z.string()
});
export const getOneFileSchema = z.object({
    id:z.string()
})
export const updateFileSchema = z.object({
    id:z.string().or(z.array(z.string())),
    content:z.string(),

})

export type TUpdateFile = z.infer<typeof updateFileSchema>
export type TCreateFile=z.infer<typeof createFileSchema>
export type TGetOneFile = z.infer<typeof getOneFileSchema>
export type TCreateFileInput=z.infer<typeof createFileInputSchema>
 export type SimpleFile={id:string,title:string}
