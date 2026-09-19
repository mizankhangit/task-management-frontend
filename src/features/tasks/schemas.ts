import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(
      3,
      "Task title must contain at least 3 characters."
    )
    .max(
      255,
      "Task title cannot exceed 255 characters."
    ),

  description: z
    .string()
    .max(
      5000,
      "Description cannot exceed 5000 characters."
    )
    .optional()
    .or(z.literal("")),

  status: z.enum([
    "todo",
    "in_progress",
    "done",
  ]),

  priority: z.enum([
    "low",
    "medium",
    "high",
  ]),

  due_date: z
    .string()
    .nullable(),

  assignee: z
    .number()
    .nullable()
    .optional(),
});

export type TaskFormValues =
  z.infer<typeof taskSchema>;