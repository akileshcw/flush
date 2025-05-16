import { loginFormSchema, registerFormSchema } from "./form.schema";

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export type LoginFormValues = z.infer<typeof loginFormSchema>;
