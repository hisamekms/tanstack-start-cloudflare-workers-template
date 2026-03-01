import { z } from "zod";

export const TodoDtoSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  completed: z.boolean(),
});

export type TodoDto = z.infer<typeof TodoDtoSchema>;
