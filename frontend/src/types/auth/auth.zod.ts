import { z } from "zod";
export const AuthSchema = z.object({
    username: z.string().min(1, {
      message: "* campo requerido.",
    }),
    password: z.string().min(1, {
      message: "* campo requerido.",
    }),
});