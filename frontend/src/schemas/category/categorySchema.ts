import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  is_active: z.boolean().optional(),
});

export type CategorySchema = z.infer<typeof categorySchema>;
