import { z } from "zod";

export const UserDtoSchema = z.object({
  id: z.string(),
  sub: z.string(),
  email: z.string(),
});

export type UserDto = z.infer<typeof UserDtoSchema>;
