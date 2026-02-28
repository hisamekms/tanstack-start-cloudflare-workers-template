import type { TodoDto } from "@contracts/todo/public";
import type { TodoError } from "@contracts/todo/public";
import type { TodoReadModelStore } from "@modules/todo-read-model";
import { ResultAsync } from "neverthrow";

export class ListTodosHandler {
  constructor(private readonly store: TodoReadModelStore) {}

  execute(): ResultAsync<TodoDto[], TodoError> {
    return ResultAsync.fromSafePromise(this.store.getAll());
  }
}
