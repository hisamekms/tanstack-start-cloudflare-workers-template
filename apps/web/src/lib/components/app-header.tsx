import { Link } from "@tanstack/react-router";
import type { AuthSession } from "start-authjs";

import { css } from "~/styled-system/css";

export function AppHeader({ session }: { session: AuthSession | null }) {
  return (
    <header
      className={css({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: "4",
        py: "3",
        borderBottom: "1px solid",
        borderColor: "border.subtle",
      })}
    >
      <Link
        to="/"
        className={css({
          fontSize: "lg",
          fontWeight: "bold",
          textDecoration: "none",
          _hover: { textDecoration: "underline" },
        })}
      >
        Home
      </Link>

      {session?.user && (
        <div className={css({ display: "flex", alignItems: "center", gap: "3" })}>
          <span className={css({ fontSize: "sm", color: "text.secondary" })}>
            {session.user.name}
          </span>
          <form method="post" action="/api/auth/signout">
            <button
              type="submit"
              className={css({
                fontSize: "sm",
                cursor: "pointer",
                border: "1px solid",
                borderColor: "border.default",
                borderRadius: "md",
                px: "3",
                py: "1",
                bg: "transparent",
                _hover: { bg: "bg.primary.hover", color: "text.inverse" },
              })}
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
