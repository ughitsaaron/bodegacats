"use client";

import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import { PropsWithChildren } from "react";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0a0a0a",
      paper: "#171717",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    divider: "rgba(255, 255, 255, 0.12)",
  },
});

export function ThemeProvider({ children }: PropsWithChildren) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
