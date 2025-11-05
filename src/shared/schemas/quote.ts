import { z } from "zod";

const baseQuoteSchema = z.object({
  body: z.string()
    .min(5, "Quote body is required and must be at least 5 characters long")
    .max(1000, "Body should be no more than 1000 characters"),
  attribution: z.string()
    .min(2, "Attribution is required and must be at least 2 characters long")
    .max(50, 'Attribution should be no more than 50 characters'),
});

export const createQuoteSchema = baseQuoteSchema;

export const updateQuoteSchema = baseQuoteSchema.extend({
  tag_ids: z.array(z.number()).optional(),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
