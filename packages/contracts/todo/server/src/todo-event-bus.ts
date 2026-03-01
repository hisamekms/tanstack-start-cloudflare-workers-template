import type { AppError } from "@contracts/shared-kernel/public";
import type { EventBus } from "@contracts/shared-kernel/server";
import type { TodoEvent } from "@contracts/todo-public";
import type { Result } from "neverthrow";

export interface TodoEventBus extends EventBus<TodoEvent> {
  publish(events: TodoEvent[]): Promise<Result<void, AppError>>;
}
