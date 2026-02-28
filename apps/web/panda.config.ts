import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{ts,tsx,js,jsx}"],
  exclude: [],
  outdir: "src/styled-system",
  importMap: "~/styled-system",
  jsxFramework: "react",
  theme: {
    extend: {
      tokens: {
        fonts: {
          sans: {
            value: '"Noto Sans JP", "Noto Sans", system-ui, -apple-system, sans-serif',
          },
          mono: {
            value: '"Noto Sans Mono", ui-monospace, SFMono-Regular, monospace',
          },
        },
        colors: {
          primary: {
            50: { value: "#eef2ff" },
            100: { value: "#e0e7ff" },
            200: { value: "#c7d2fe" },
            300: { value: "#a5b4fc" },
            400: { value: "#818cf8" },
            500: { value: "#6366f1" },
            600: { value: "#4f46e5" },
            700: { value: "#4338ca" },
            800: { value: "#3730a3" },
            900: { value: "#312e81" },
            950: { value: "#1e1b4b" },
          },
          secondary: {
            50: { value: "#f0fdfa" },
            100: { value: "#ccfbf1" },
            200: { value: "#99f6e4" },
            300: { value: "#5eead4" },
            400: { value: "#2dd4bf" },
            500: { value: "#14b8a6" },
            600: { value: "#0d9488" },
            700: { value: "#0f766e" },
            800: { value: "#115e59" },
            900: { value: "#134e4a" },
            950: { value: "#042f2e" },
          },
          neutral: {
            50: { value: "#fafafa" },
            100: { value: "#f5f5f5" },
            150: { value: "#ededed" },
            200: { value: "#e5e5e5" },
            250: { value: "#dedede" },
            300: { value: "#d4d4d4" },
            400: { value: "#a3a3a3" },
            500: { value: "#737373" },
            600: { value: "#525252" },
            700: { value: "#404040" },
            800: { value: "#262626" },
            900: { value: "#171717" },
            950: { value: "#0a0a0a" },
          },
        },
        spacing: {
          "1x": { value: "8px" },
          "2x": { value: "16px" },
          "3x": { value: "24px" },
          "4x": { value: "32px" },
          "5x": { value: "40px" },
          "6x": { value: "48px" },
          "7x": { value: "56px" },
          "8x": { value: "64px" },
          "9x": { value: "72px" },
          "10x": { value: "80px" },
          "11x": { value: "88px" },
          "12x": { value: "96px" },
        },
        radii: {
          none: { value: "0" },
          sm: { value: "8px" },
          md: { value: "12px" },
          lg: { value: "16px" },
          xl: { value: "24px" },
          "2xl": { value: "32px" },
          full: { value: "9999px" },
        },
        shadows: {
          "1": { value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
          "2": { value: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)" },
          "3": { value: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)" },
          "4": { value: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)" },
          "5": {
            value: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          },
          "6": { value: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" },
          "7": { value: "0 35px 60px -15px rgba(0, 0, 0, 0.3)" },
          "8": { value: "0 45px 100px -20px rgba(0, 0, 0, 0.35)" },
          overlay: { value: "0 0 0 9999px rgba(0, 0, 0, 0.4)" },
        },
      },
      semanticTokens: {
        colors: {
          bg: {
            canvas: { value: "{colors.white}" },
            surface: { value: "{colors.white}" },
            subtle: { value: "{colors.neutral.50}" },
            muted: { value: "{colors.neutral.100}" },
            emphasis: { value: "{colors.neutral.700}" },
            inverse: { value: "{colors.neutral.900}" },
            primary: {
              DEFAULT: { value: "{colors.primary.600}" },
              hover: { value: "{colors.primary.700}" },
            },
            secondary: {
              DEFAULT: { value: "{colors.secondary.600}" },
              hover: { value: "{colors.secondary.700}" },
            },
          },
          text: {
            primary: { value: "{colors.neutral.900}" },
            secondary: { value: "{colors.neutral.600}" },
            tertiary: { value: "{colors.neutral.500}" },
            disabled: { value: "{colors.neutral.400}" },
            inverse: { value: "{colors.white}" },
            link: {
              DEFAULT: { value: "{colors.primary.600}" },
              hover: { value: "{colors.primary.700}" },
            },
          },
          border: {
            default: { value: "{colors.neutral.300}" },
            subtle: { value: "{colors.neutral.200}" },
            emphasis: { value: "{colors.neutral.700}" },
            focus: { value: "{colors.primary.500}" },
            primary: { value: "{colors.primary.600}" },
          },
          success: {
            DEFAULT: { value: "{colors.green.500}" },
            subtle: { value: "{colors.green.50}" },
            text: { value: "{colors.green.700}" },
          },
          error: {
            DEFAULT: { value: "{colors.red.500}" },
            subtle: { value: "{colors.red.50}" },
            text: { value: "{colors.red.700}" },
          },
          warning: {
            DEFAULT: { value: "{colors.yellow.500}" },
            subtle: { value: "{colors.yellow.50}" },
            text: { value: "{colors.yellow.700}" },
          },
        },
      },
      textStyles: {
        display: {
          lg: {
            value: {
              fontSize: "3.5rem",
              lineHeight: "1.2",
              fontWeight: "700",
              letterSpacing: "-0.02em",
            },
          },
          md: {
            value: {
              fontSize: "2.75rem",
              lineHeight: "1.2",
              fontWeight: "700",
              letterSpacing: "-0.02em",
            },
          },
          sm: {
            value: {
              fontSize: "2.25rem",
              lineHeight: "1.25",
              fontWeight: "700",
              letterSpacing: "-0.02em",
            },
          },
        },
        heading: {
          lg: {
            value: { fontSize: "1.5rem", lineHeight: "1.4", fontWeight: "700" },
          },
          md: {
            value: { fontSize: "1.25rem", lineHeight: "1.4", fontWeight: "700" },
          },
          sm: {
            value: { fontSize: "1.125rem", lineHeight: "1.4", fontWeight: "700" },
          },
        },
        body: {
          lg: {
            value: { fontSize: "1.125rem", lineHeight: "1.75", fontWeight: "400" },
          },
          md: {
            value: { fontSize: "1rem", lineHeight: "1.75", fontWeight: "400" },
          },
          sm: {
            value: { fontSize: "0.875rem", lineHeight: "1.7", fontWeight: "400" },
          },
        },
        dense: {
          md: {
            value: { fontSize: "1rem", lineHeight: "1.5", fontWeight: "400" },
          },
          sm: {
            value: { fontSize: "0.875rem", lineHeight: "1.5", fontWeight: "400" },
          },
        },
        oneline: {
          lg: {
            value: { fontSize: "1.125rem", lineHeight: "1.4", fontWeight: "400" },
          },
          md: {
            value: { fontSize: "1rem", lineHeight: "1.4", fontWeight: "400" },
          },
          sm: {
            value: { fontSize: "0.875rem", lineHeight: "1.4", fontWeight: "400" },
          },
        },
        mono: {
          md: {
            value: { fontSize: "1rem", lineHeight: "1.75", fontWeight: "400", fontFamily: "mono" },
          },
          sm: {
            value: {
              fontSize: "0.875rem",
              lineHeight: "1.7",
              fontWeight: "400",
              fontFamily: "mono",
            },
          },
        },
      },
    },
  },
  globalCss: {
    html: {
      lineHeight: "1.5",
      WebkitTextSizeAdjust: "100%",
    },
    body: {
      fontFamily: "sans",
      color: "text.primary",
      bg: "bg.canvas",
    },
    "*, *::before, *::after": {
      borderColor: "border.default",
    },
    a: {
      color: "text.link",
      _hover: {
        color: "text.link.hover",
      },
    },
  },
});
