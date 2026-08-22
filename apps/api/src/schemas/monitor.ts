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

export const listMonitorsSchema = z.object({
  userId: z.uuid(),
});

export const updateMonitorSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    url: z.string().url().optional(),
    method: z
      .enum(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"])
      .optional(),
    intervalSeconds: z.number().int().positive().optional(),
    timeoutMs: z.number().int().positive().optional(),
    expectedStatusCode: z.number().int().min(100).max(599).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateMonitorInput = z.infer<typeof createMonitorSchema>;
export type ListMonitorsInput = z.infer<typeof listMonitorsSchema>;
export type UpdateMonitorInput = z.infer<typeof updateMonitorSchema>;
