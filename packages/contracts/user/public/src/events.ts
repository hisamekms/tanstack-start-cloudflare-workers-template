import { DomainEventSchema } from "@contracts/shared-kernel/public";
import { z } from "zod";

export const UserCreatedEventSchema = DomainEventSchema.extend({
  eventType: z.literal("UserCreated"),
  userId: z.string().min(1),
  sub: z.string().min(1),
  email: z.string().min(1),
});

export type UserCreatedEvent = z.infer<typeof UserCreatedEventSchema>;

export const UserEventSchema = z.discriminatedUnion("eventType", [UserCreatedEventSchema]);

export type UserEvent = z.infer<typeof UserEventSchema>;
