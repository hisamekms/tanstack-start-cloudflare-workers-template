import { z } from "zod";

export const DomainEventSchema = z.object({
  eventType: z.string(),
  occurredAt: z.string().datetime(),
  schemaVersion: z.number().int().nonnegative(),
  aggregateVersion: z.number().int().nonnegative(),
});

export type DomainEvent = z.infer<typeof DomainEventSchema>;
