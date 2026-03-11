import { z } from "zod";

export const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(3, "Nome deve ter pelo menos 3 caracteres")
      .optional(),
    last_name: z
      .string()
      .min(3, "Sobrenome nome deve ter pelo menos 3 caracteres")
      .optional(),
    email: z.email("Email inválido"),
    username: z.string().min(3, "Username deve ter pelo menos 3 caracteres"),
    password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
