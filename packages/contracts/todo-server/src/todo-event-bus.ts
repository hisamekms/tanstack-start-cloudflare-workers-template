import type { EventBus } from "@contracts/shared-kernel-server";
import type { TodoEvent } from "@contracts/todo-public";

export interface TodoEventBus extends EventBus<TodoEvent> {
  publish(events: TodoEvent[]): Promise<void>;
}
