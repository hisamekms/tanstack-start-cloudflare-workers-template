import { Link, createFileRoute } from "@tanstack/react-router";

import { css } from "~/styled-system/css";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
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
          mb: "4",
        })}
      >
        Home
      </h1>
      <p className={css({ color: "gray.600" })}>Panda CSS is working!</p>
      <Link
        to="/todos"
        className={css({
          color: "blue.600",
          fontWeight: "semibold",
          _hover: { color: "blue.700", textDecoration: "underline" },
        })}
      >
        Todos
      </Link>
    </div>
  );
}
