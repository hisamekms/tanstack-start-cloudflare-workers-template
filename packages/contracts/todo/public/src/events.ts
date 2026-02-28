import type { DomainEvent } from "@contracts/shared-kernel/public";

export interface TodoCreatedEvent extends DomainEvent {
  readonly eventType: "TodoCreated";
  readonly todoId: string;
  readonly title: string;
}

export interface TodoCompletedEvent extends DomainEvent {
  readonly eventType: "TodoCompleted";
  readonly todoId: string;
}

export type TodoEvent = TodoCreatedEvent | TodoCompletedEvent;
