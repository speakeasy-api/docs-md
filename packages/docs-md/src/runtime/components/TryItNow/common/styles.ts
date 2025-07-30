import type { CSSProperties } from "react";

const theme = {
  colors: {
    primary: "rgb(251, 227, 50)",
    primaryHover: "rgb(230, 209, 46)",
    primaryActive: "rgb(220, 199, 40)",

    bgPrimary: "#ffffff",
    bgSecondary: "#f8fafc",

    borderPrimary: "#e2e8f0",
    borderSecondary: "#f1f5f9",
    borderMuted: "#cbd5e1",

    textPrimary: "#0f172a",
    textSecondary: "#1f2937",
    textMuted: "#64748b",
    textDisabled: "#94a3b8",

    success: "#f0b100",
    error: "#dc2626",
    warning: "#d97706",

    disabledBg: "#e2e8f0",
    disabledText: "#94a3b8",
  },
};

// TODO: convert this to a CSS module
export const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "75rem",
    margin: "0 auto",
    background: theme.colors.bgPrimary,
    border: `1px solid ${theme.colors.borderPrimary}`,
    borderRadius: "1rem",
    overflow: "hidden",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  },

  containerMobile: {
    margin: "1rem",
    borderRadius: "0.75rem",
  },

  preview: {
    display: "none",
  },

  content: {
    display: "flex",
    flex: 1,
    minHeight: 0,
    background: theme.colors.bgSecondary,
  },
};
