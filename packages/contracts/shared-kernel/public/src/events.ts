import { z } from "zod";

export const DomainEventSchema = z.object({
  eventType: z.string(),
  occurredAt: z.string(),
  schemaVersion: z.number(),
  aggregateVersion: z.number(),
});

export type DomainEvent = z.infer<typeof DomainEventSchema>;
