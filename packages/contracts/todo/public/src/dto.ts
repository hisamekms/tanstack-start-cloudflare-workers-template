import { z } from "zod";

export const TodoDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
});

export type TodoDto = z.infer<typeof TodoDtoSchema>;
