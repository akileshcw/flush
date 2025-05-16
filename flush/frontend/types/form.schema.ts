import * as z from "zod";

export const registerFormSchema = z.object({
  email: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  confirmPassword: z.string().min(1),
});

export const loginFormSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});
