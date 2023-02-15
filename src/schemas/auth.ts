import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(4, { message: "Password should be at least 4 characters long" }),
});
export const signupSchema=loginSchema.extend({
    username: z.string().min(4,'Username must be at least 4 characters long'),
})

export const testSchema=z.object({
    name:z.string(),
    email:z.string().email()
})

export const tokenSchema=z.string()

export type ILogin=z.infer<typeof loginSchema>
export type ISignup=z.infer<typeof signupSchema>

