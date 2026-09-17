import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      3,
      "Project name must contain at least 3 characters."
    )
    .max(
      255,
      "Project name cannot exceed 255 characters."
    ),

  description: z
    .string()
    .max(
      5000,
      "Description cannot exceed 5000 characters."
    )
    .optional()
    .or(z.literal("")),
});

export type ProjectFormValues =
  z.infer<typeof projectSchema>;