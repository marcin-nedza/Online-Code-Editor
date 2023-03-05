import * as z from "zod";

export const codeSchema = z.object({
  content: z.string().min(5, "Code must be at least 5 characters long"),
});
export const fileSchema=z.array(z.object({

  title: z.string(),
  content: z.string(),
}))

export const file2Schema=z.object({
   files: z.array(z.object({
  title: z.string(),
  content: z.string(),
    })),
   current: z.string()
})
export type TCode = z.infer<typeof codeSchema>;
export type TFile = z.infer<typeof fileSchema>;
export type TFile2 = z.infer<typeof file2Schema>;

