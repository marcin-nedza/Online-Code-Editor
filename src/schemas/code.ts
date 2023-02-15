import * as z from "zod";

export const codeSchema=z.object({
    content:z.string().min(5,'Code must be at least 5 characters long'),


})
export type TCode=z.infer<typeof codeSchema>
