import type { DomainEvent } from "@contracts/shared-kernel-public";

export interface EventBus<TEvent extends DomainEvent = DomainEvent> {
  publish(events: TEvent[]): Promise<void>;
}
