import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { listTodos } from "~/lib/todo/todo";
import { css } from "~/styled-system/css";

const todosQueryOptions = {
  queryKey: ["todos"],
  queryFn: () => listTodos(),
};

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(todosQueryOptions),
  component: Home,
});

function Home() {
  const { data: todos = [] } = useQuery(todosQueryOptions);

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const completion = total > 0 ? Math.round((completed / total) * 100) : 0;

  const metrics = [
    { label: "Total", value: total },
    { label: "Completed", value: completed },
    { label: "Pending", value: pending },
    { label: "Completion", value: `${completion}%` },
  ];

  return (
    <div
      className={css({
        maxW: "800px",
        mx: "auto",
        py: "8",
        px: "4",
      })}
    >
      <h1
        className={css({
          fontSize: "3xl",
          fontWeight: "bold",
          mb: "6",
        })}
      >
        Home
      </h1>

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "4",
          mb: "6",
        })}
      >
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={css({
              p: "4",
              border: "1px solid",
              borderColor: "border.subtle",
              borderRadius: "md",
              textAlign: "center",
            })}
          >
            <div className={css({ fontSize: "2xl", fontWeight: "bold" })}>{metric.value}</div>
            <div className={css({ fontSize: "sm", color: "text.secondary" })}>{metric.label}</div>
          </div>
        ))}
      </div>

      <Link
        to="/todos"
        className={css({
          fontWeight: "semibold",
          _hover: { textDecoration: "underline" },
        })}
      >
        Todos
      </Link>
    </div>
  );
}
