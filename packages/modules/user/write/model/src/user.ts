import type { AggregateRoot } from "@contracts/shared-kernel/public";
import type { UserCreatedEvent } from "@contracts/user-public";
import type { CommandResult } from "@modules/shared-kernel-write-model";

export interface User extends AggregateRoot<string> {
  readonly sub: string;
  readonly email: string;
}

export function createUser(
  id: string,
  sub: string,
  email: string,
): CommandResult<User, UserCreatedEvent> {
  const state: User = { id, sub, email, version: 1 };
  const events: UserCreatedEvent[] = [
    {
      eventType: "UserCreated",
      occurredAt: new Date().toISOString(),
      schemaVersion: 1,
      aggregateVersion: 1,
      userId: id,
      sub,
      email,
    },
  ];
  return { state, events };
}
