import { ApplicationError } from "@contracts/shared-kernel/public";

export class UnknownUserCommandError extends ApplicationError {
  readonly tag = "UnknownUserCommand" as const;
  constructor(readonly commandType: string) {
    super(`Unknown command: ${commandType}`);
  }
}

export type UserError = UnknownUserCommandError;
