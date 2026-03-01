import { z } from "zod";

export const UserDtoSchema = z.object({
  id: z.string().min(1),
  sub: z.string().min(1),
  email: z.string().email(),
});

export type UserDto = z.infer<typeof UserDtoSchema>;
