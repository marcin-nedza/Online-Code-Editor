import * as z from "zod";

export const createFileInputSchema=z.object({
    title: z.string().min(2, "Title should be at least 2 characters long"),

})
export const createFileSchema= createFileInputSchema.extend({
    projectId:z.string()
});


export type TCreateFile=z.infer<typeof createFileSchema>
export type TCreateFileInput=z.infer<typeof createFileInputSchema>
