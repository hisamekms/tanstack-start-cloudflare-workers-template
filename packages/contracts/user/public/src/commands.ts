import { commandSchema } from "@contracts/shared-kernel/public";
import { z } from "zod";

export enum UserCommandType {
  EnsureUser = "EnsureUser",
}

export const EnsureUserCommandSchema = commandSchema(UserCommandType.EnsureUser).extend({
  sub: z.string().min(1),
  email: z.string().email(),
});

export type EnsureUserCommand = z.infer<typeof EnsureUserCommandSchema>;

export const UserCommandSchema = z.discriminatedUnion("commandType", [EnsureUserCommandSchema]);

export type UserCommand = z.infer<typeof UserCommandSchema>;
