import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  collaborators: z.array(z.string()).optional(),
  category: z.number(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  is_completed: z.boolean().optional(),
  is_active: z.boolean().optional(),
  due_date: z.string().optional(),
});

export type TaskSchema = z.output<typeof taskSchema>;
