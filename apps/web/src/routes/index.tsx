import { createFileRoute } from "@tanstack/react-router";

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
      <p className={css({ color: "text.secondary" })}>Panda CSS is working!</p>
    </div>
  );
}
