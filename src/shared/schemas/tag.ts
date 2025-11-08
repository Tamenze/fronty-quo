import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string()
  .min(2, "Name must be at least 2 characters long")
  .max(25, "Name must be less than 25 characters long")
})

export type CreateTagInput = z.infer<typeof createTagSchema>;
