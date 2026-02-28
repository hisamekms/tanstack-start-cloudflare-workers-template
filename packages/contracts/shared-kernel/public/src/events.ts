export interface DomainEvent {
  readonly eventType: string;
  readonly occurredAt: string;
  readonly schemaVersion: number;
  readonly aggregateVersion: number;
}
