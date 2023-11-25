// this file is humbly stolen from https://github.com/owlbear-rodeo/initiative-tracker/blob/main/src/PluginThemeProvider.tsx
// modified to not cause flashbangs when loading in dark mode

import { Skeleton } from "@mui/material";
import { Theme as MuiTheme, createTheme } from "@mui/material/styles";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import OBR, { Theme } from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";

/**
 * Create a MUI theme based off of the current OBR theme
 */
function getTheme(theme?: Theme) {
  return createTheme({
    palette: theme
      ? {
        mode: theme.mode === "LIGHT" ? "light" : "dark",
        text: theme.text,
        primary: theme.primary,
        secondary: theme.secondary,
        background: theme?.background,
      }
      : undefined,
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
    },
  });
}

/**
 * Provide a MUI theme with the same palette as the parent OBR window
 * Wait for a theme before rendering
 */
export function PluginThemeProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [theme, setTheme] = useState<MuiTheme | undefined>(undefined);
  useEffect(() => {
    const updateTheme = (theme: Theme) => {
      setTheme(getTheme(theme));
    };
    OBR.theme.getTheme().then(updateTheme);

    return OBR.theme.onChange(updateTheme);
  }, []);

  return theme ? <ThemeProvider theme={theme}>{children}</ThemeProvider> : <Skeleton></Skeleton>;
}
