import type { Context } from "@contracts/shared-kernel/server";
import type { TodoDto } from "@contracts/todo-public";
import type { TodoError } from "@contracts/todo-public";
import type { TodoReadModelStore } from "@modules/todo-read-model";
import { ResultAsync } from "neverthrow";

export class ListTodosHandler {
  constructor(private readonly store: TodoReadModelStore) {}

  execute(context: Context): ResultAsync<TodoDto[], TodoError> {
    if (context.kind === "protected") {
      return ResultAsync.fromSafePromise(this.store.getByUserId(context.userId));
    }
    return ResultAsync.fromSafePromise(this.store.getAll());
  }
}
