import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { listTodos, createTodo, completeTodo } from "~/lib/todo.server";
import { css } from "~/styled-system/css";

const todosQueryOptions = {
  queryKey: ["todos"],
  queryFn: () => listTodos(),
};

export const Route = createFileRoute("/todos")({
  loader: ({ context }) => context.queryClient.ensureQueryData(todosQueryOptions),
  component: TodosPage,
});

function TodosPage() {
  const queryClient = useQueryClient();
  const { data: todos = [] } = useQuery(todosQueryOptions);
  const [title, setTitle] = useState("");

  const createMutation = useMutation({
    mutationFn: (newTitle: string) => createTodo({ data: { title: newTitle } }),
    onSuccess: (data) => {
      queryClient.setQueryData(todosQueryOptions.queryKey, data);
      setTitle("");
    },
  });

  const completeMutation = useMutation({
    mutationFn: (todoId: string) => completeTodo({ data: { todoId } }),
    onSuccess: (data) => {
      queryClient.setQueryData(todosQueryOptions.queryKey, data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    createMutation.mutate(trimmed);
  };

  return (
    <div className={css({ maxW: "800px", mx: "auto", py: "8", px: "4" })}>
      <h1 className={css({ fontSize: "3xl", fontWeight: "bold", mb: "6" })}>Todos</h1>

      <form onSubmit={handleSubmit} className={css({ display: "flex", gap: "2", mb: "6" })}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New todo..."
          className={css({
            flex: "1",
            px: "3",
            py: "2",
            border: "1px solid",
            borderColor: "gray.300",
            borderRadius: "md",
            fontSize: "md",
          })}
        />
        <button
          type="submit"
          disabled={createMutation.isPending}
          className={css({
            px: "4",
            py: "2",
            bg: "blue.600",
            color: "white",
            borderRadius: "md",
            fontWeight: "semibold",
            cursor: "pointer",
            _hover: { bg: "blue.700" },
            _disabled: { opacity: 0.5, cursor: "not-allowed" },
          })}
        >
          Add
        </button>
      </form>

      <ul className={css({ display: "flex", flexDir: "column", gap: "2" })}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "3",
              p: "3",
              border: "1px solid",
              borderColor: "gray.200",
              borderRadius: "md",
            })}
          >
            <button
              type="button"
              onClick={() => !todo.completed && completeMutation.mutate(todo.id)}
              disabled={todo.completed || completeMutation.isPending}
              className={css({
                w: "5",
                h: "5",
                borderRadius: "full",
                border: "2px solid",
                borderColor: todo.completed ? "green.500" : "gray.300",
                bg: todo.completed ? "green.500" : "transparent",
                cursor: todo.completed ? "default" : "pointer",
                flexShrink: 0,
              })}
              aria-label={todo.completed ? "Completed" : "Mark as complete"}
            />
            <span
              className={css({
                fontSize: "md",
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "gray.400" : "gray.900",
              })}
            >
              {todo.title}
            </span>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className={css({ color: "gray.500", textAlign: "center", py: "8" })}>
          No todos yet. Add one above!
        </p>
      )}
    </div>
  );
}
