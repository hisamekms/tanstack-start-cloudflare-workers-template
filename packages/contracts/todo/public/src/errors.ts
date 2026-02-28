import { ApplicationError, DomainError } from "@contracts/shared-kernel/public";

export class TodoNotFoundError extends DomainError {
  readonly tag = "TodoNotFound" as const;
  constructor(readonly todoId: string) {
    super(`Todo not found: ${todoId}`);
  }
}

export class UnknownTodoCommandError extends ApplicationError {
  readonly tag = "UnknownTodoCommand" as const;
  constructor(readonly commandType: string) {
    super(`Unknown command: ${commandType}`);
  }
}

export class UnknownTodoQueryError extends ApplicationError {
  readonly tag = "UnknownTodoQuery" as const;
  constructor(readonly queryType: string) {
    super(`Unknown query: ${queryType}`);
  }
}

export type TodoError = TodoNotFoundError | UnknownTodoCommandError | UnknownTodoQueryError;
