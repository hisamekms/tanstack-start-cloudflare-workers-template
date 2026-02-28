import type { AppError, DomainEvent } from "@contracts/shared-kernel/public";
import type { Result } from "neverthrow";

export interface EventBus<
  TEvent extends DomainEvent = DomainEvent,
  TError extends AppError = AppError,
> {
  publish(events: TEvent[]): Promise<Result<void, TError>>;
}
