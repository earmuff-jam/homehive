import type { Components, ThemeOptions } from "@mui/material";
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    transparent: Palette["primary"];
  }

  interface PaletteOptions {
    transparent?: PaletteOptions["primary"];
  }
}

const commonTypography: ThemeOptions["typography"] = {
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  htmlFontSize: 16,

  h1: {
    fontWeight: 700,
    fontSize: "2.5rem",
    lineHeight: 1.2,
    letterSpacing: "-0.015em",
  },
  h2: {
    fontWeight: 600,
    fontSize: "2rem",
    lineHeight: 1.3,
    letterSpacing: "-0.01em",
  },
  h3: {
    fontWeight: 600,
    fontSize: "1.75rem",
    lineHeight: 1.35,
    letterSpacing: "-0.005em",
  },
  h4: {
    fontWeight: 600,
    fontSize: "1.5rem",
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 600,
    fontSize: "1.25rem",
    lineHeight: 1.5,
  },
  h6: {
    fontWeight: 600,
    fontSize: "1rem",
    lineHeight: 1.6,
    textTransform: "none",
  },
  subtitle1: {
    fontWeight: 500,
    fontSize: "1rem",
    lineHeight: 1.5,
  },
  subtitle2: {
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },
  body1: {
    fontSize: "1rem",
    lineHeight: 1.65,
    fontWeight: 400,
  },
  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.6,
    fontWeight: 400,
  },
  button: {
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: 1.5,
    letterSpacing: "0.02em",
    textTransform: "none",
  },
  caption: {
    fontSize: "0.75rem",
    lineHeight: 1.4,
    fontWeight: 400,
  },
  overline: {
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
};

const commonComponents: Components = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
        borderRadius: 4,
        fontWeight: 500,
      },
      containedPrimary: {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontSize: "0.875rem",
        borderRadius: 4,
        textTransform: "none",
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0E7C6B",
      light: "#37A699",
      dark: "#0B5D50",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#3D4B72",
      light: "#5E6D98",
      dark: "#2E3A58",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A202C",
      secondary: "#4A5568",
    },
    divider: "rgba(0, 0, 0, 0.08)",
    success: { main: "#38A169" },
    info: { main: "#3182CE" },
    warning: { main: "#DD6B20" },
    error: { main: "#E53E3E" },
    transparent: {
      main: "rgba(0, 0, 0, 0)",
    },
  },
  typography: commonTypography,
  components: {
    ...commonComponents,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#1A202C",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffb300",
      light: "#ffd54f",
      dark: "#ff8f00",
      contrastText: "#121212",
    },
    secondary: {
      main: "#8EACBB",
      light: "#B0C5D1",
      dark: "#6D8A9C",
      contrastText: "#121212",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#ECEFF1",
      secondary: "#B0BEC5",
    },
    divider: "rgba(255, 255, 255, 0.08)",
    success: { main: "#4CAF50" },
    info: { main: "#64B5F6" },
    warning: { main: "#FFB74D" },
    error: { main: "#E57373" },
    transparent: {
      main: "rgba(0, 0, 0, 0)",
    },
  },
  typography: commonTypography,
  components: {
    ...commonComponents,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1E1E1E",
          color: "#FFFFFF",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1E1E1E",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1E1E1E",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#252525",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        thumb: {
          backgroundColor: "#4ECDC4",
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});
