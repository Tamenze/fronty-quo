import { z } from "zod";

const baseQuoteSchema = z.object({
  body: z.string().min(5, "Quote text is required"), //add specific messages around char min and max 
  attribution: z.string().min(1, "Attribution is required"),
    //look at docs for text validators that might be cool 
    //

});

export const createQuoteSchema = baseQuoteSchema;

export const updateQuoteSchema = baseQuoteSchema.extend({
  tag_ids: z.array(z.number()).optional(),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
