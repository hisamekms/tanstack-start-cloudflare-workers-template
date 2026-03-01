import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  redirect,
  useRouteContext,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { fetchSession } from "~/server/auth/auth-session";
import { AppHeader } from "~/public/components/ui/app-header";
import type { RouterContext } from "~/public/lib/router-context";

import globalCss from "~/styles/global.css?url";

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ location }) => {
    const session = await fetchSession();
    if (!session?.user) {
      throw redirect({
        href: `/api/auth/signin?callbackUrl=${encodeURIComponent(location.href)}`,
      });
    }
    return { session };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Web" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Sans+Mono:wght@400;700&display=swap",
      },
      { rel: "stylesheet", href: globalCss },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
});

function RootComponent() {
  const { session } = useRouteContext({ from: "__root__" });
  return (
    <>
      <AppHeader session={session} />
      <Outlet />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
