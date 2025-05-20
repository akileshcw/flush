import { phoneNumber } from "better-auth/plugins";
import * as z from "zod";

export const registerFormSchema = z.object({
  email: z.string().min(1),
  name: z.string().min(1),
  phoneNumber: z.string().min(1),
  password: z.string().min(1),
  confirmPassword: z.string().min(1),
});

export const loginFormSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
