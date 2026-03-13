import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  collaborators: z.preprocess((val) => {
    if (Array.isArray(val)) {
      const nums = val.map(Number).filter((n) => !isNaN(n) && n > 0);
      return nums.length > 0 ? nums : undefined;
    }
    const num = Number(val);
    return !isNaN(num) && num > 0 ? [num] : undefined;
  }, z.array(z.number()).optional()),
  category: z.coerce.number().refine((n) => n > 0, {
    message: "Categoria é obrigatória",
  }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  is_completed: z.boolean().optional(),
  is_active: z.boolean().optional(),
  due_date: z.string().optional(),
});

export type TaskSchema = z.infer<typeof taskSchema>;
