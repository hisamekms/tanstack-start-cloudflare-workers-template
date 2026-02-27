import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{ts,tsx,js,jsx}"],
  exclude: [],
  outdir: "src/styled-system",
  importMap: "~/styled-system",
  jsxFramework: "react",
  globalCss: {
    html: {
      lineHeight: "1.5",
      WebkitTextSizeAdjust: "100%",
    },
    body: {
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
  },
});
