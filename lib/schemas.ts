import { z } from "zod";

 export const resetSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid Email"
  }),
})

export const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid Email"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters."
  }),
})

export const signupSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid Email"
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters."
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters."
  })
})