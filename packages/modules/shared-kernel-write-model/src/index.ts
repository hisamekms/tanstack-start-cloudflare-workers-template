import type { DomainEvent } from "@contracts/shared-kernel-public";

export abstract class Entity<TId extends string = string> {
  abstract readonly id: TId;
  private _events: DomainEvent[] = [];

  protected addEvent(event: DomainEvent): void {
    this._events.push(event);
  }

  pullEvents(): DomainEvent[] {
    const events = [...this._events];
    this._events = [];
    return events;
  }
}
