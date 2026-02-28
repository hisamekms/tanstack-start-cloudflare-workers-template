import type { DomainEvent } from "@contracts/shared-kernel/public";
import type { Result } from "neverthrow";

export interface EventBus<TEvent extends DomainEvent = DomainEvent> {
  publish(events: TEvent[]): Promise<Result<void, string>>;
}
