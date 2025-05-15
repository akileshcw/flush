import { registerFormSchema } from "./form.schema";

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
