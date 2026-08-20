import { z } from "zod";

export const createMonitorSchema = z.object({
  userId: z.uuid(),
  name: z.string().min(1).max(255),
  url: z.url(),
  method: z
    .string()
    .transform((value) => value.toUpperCase())
    .pipe(z.enum(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"])),
  intervalSeconds: z.number().int().positive(),
  timeoutMs: z.number().int().positive(),
  expectedStatusCode: z.number().int().min(100).max(599),
});

export type CreateMonitorInput = z.infer<typeof createMonitorSchema>;
