import { DomainEventSchema } from "@contracts/shared-kernel/public";
import { z } from "zod";

export const TodoCreatedEventSchema = DomainEventSchema.extend({
  eventType: z.literal("TodoCreated"),
  todoId: z.string().min(1),
  title: z.string().min(1),
});

export type TodoCreatedEvent = z.infer<typeof TodoCreatedEventSchema>;

export const TodoCompletedEventSchema = DomainEventSchema.extend({
  eventType: z.literal("TodoCompleted"),
  todoId: z.string().min(1),
});

export type TodoCompletedEvent = z.infer<typeof TodoCompletedEventSchema>;

export const TodoEventSchema = z.discriminatedUnion("eventType", [
  TodoCreatedEventSchema,
  TodoCompletedEventSchema,
]);

export type TodoEvent = z.infer<typeof TodoEventSchema>;
