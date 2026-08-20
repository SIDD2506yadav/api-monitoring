import { z } from "zod";

export const testRequestSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
});
