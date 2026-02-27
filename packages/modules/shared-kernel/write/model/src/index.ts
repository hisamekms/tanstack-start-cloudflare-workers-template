import type { AggregateRoot } from "@contracts/shared-kernel-public";
import type { DomainEvent } from "@contracts/shared-kernel-public";

export interface CommandResult<
  TState extends AggregateRoot,
  TEvent extends DomainEvent = DomainEvent,
> {
  readonly state: TState;
  readonly events: TEvent[];
}
