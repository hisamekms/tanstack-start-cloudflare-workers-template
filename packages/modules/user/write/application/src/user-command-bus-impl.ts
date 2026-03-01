import type { Context } from "@contracts/shared-kernel/server";
import { UserCommandType } from "@contracts/user-public";
import type { UserCommand } from "@contracts/user-public";
import { UnknownUserCommandError, type UserError } from "@contracts/user-public";
import type { UserCommandBus } from "@contracts/user-server";
import { errAsync, type ResultAsync } from "neverthrow";

import type { EnsureUserHandler } from "./handlers/ensure-user-handler";

export class UserCommandBusImpl implements UserCommandBus {
  constructor(private readonly ensureUserHandler: EnsureUserHandler) {}

  execute(command: UserCommand, context: Context): ResultAsync<void, UserError> {
    switch (command.commandType) {
      case UserCommandType.EnsureUser:
        return this.ensureUserHandler.execute(command, context);
      default:
        return errAsync(new UnknownUserCommandError((command as UserCommand).commandType));
    }
  }
}
