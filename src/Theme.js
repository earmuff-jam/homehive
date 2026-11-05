import { createTheme } from "@mui/material";

const commonTypography = {
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

  htmlFontSize: 16,

  h1: {
    fontWeight: 700,
    fontSize: "2.5rem",
    lineHeight: 1.2,
    letterSpacing: "-0.03em",
  },

  h2: {
    fontWeight: 700,
    fontSize: "2rem",
    lineHeight: 1.25,
    letterSpacing: "-0.025em",
  },

  h3: {
    fontWeight: 650,
    fontSize: "1.75rem",
    lineHeight: 1.3,
    letterSpacing: "-0.02em",
  },

  h4: {
    fontWeight: 650,
    fontSize: "1.5rem",
    lineHeight: 1.35,
    letterSpacing: "-0.015em",
  },

  h5: {
    fontWeight: 650,
    fontSize: "1.25rem",
    lineHeight: 1.4,
    letterSpacing: "-0.01em",
  },

  h6: {
    fontWeight: 650,
    fontSize: "1rem",
    lineHeight: 1.5,
  },

  subtitle1: {
    fontWeight: 500,
    fontSize: "1rem",
    lineHeight: 1.5,
  },

  subtitle2: {
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: 1.45,
  },

  body1: {
    fontSize: "1rem",
    lineHeight: 1.6,
    fontWeight: 400,
  },

  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.55,
    fontWeight: 400,
  },

  button: {
    fontWeight: 600,
    fontSize: "0.875rem",
    lineHeight: 1.4,
    letterSpacing: 0,
    textTransform: "none",
  },

  caption: {
    fontSize: "0.75rem",
    lineHeight: 1.4,
    fontWeight: 400,
  },

  overline: {
    fontSize: "0.6875rem",
    lineHeight: 1.4,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
};

const commonComponents = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },

    styleOverrides: {
      root: {
        minHeight: 40,
        borderRadius: 10,
        fontWeight: 600,
        padding: "8px 16px",
        transition:
          "background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 100ms ease",

        "&:active": {
          transform: "translateY(1px)",
        },
      },

      sizeSmall: {
        minHeight: 34,
        padding: "6px 12px",
        borderRadius: 8,
      },

      sizeLarge: {
        minHeight: 46,
        padding: "10px 20px",
        borderRadius: 11,
      },

      containedPrimary: {
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",

        "&:hover": {
          boxShadow: "0 4px 12px rgba(14, 124, 107, 0.18)",
        },
      },

      outlined: {
        borderWidth: 1,
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 14,
        border: "1px solid var(--mui-card-border)",
        boxShadow: "var(--mui-card-shadow)",
        backgroundImage: "none",
        overflow: "hidden",
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },

      rounded: {
        borderRadius: 14,
      },
    },
  },

  MuiAppBar: {
    defaultProps: {
      elevation: 0,
    },

    styleOverrides: {
      root: {
        backgroundImage: "none",
        boxShadow: "none",
      },
    },
  },

  MuiToolbar: {
    styleOverrides: {
      root: {
        minHeight: 64,
      },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 10,

        "& .MuiOutlinedInput-notchedOutline": {
          transition: "border-color 160ms ease, box-shadow 160ms ease",
        },

        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(14, 124, 107, 0.45)",
        },

        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderWidth: 1,
        },

        "&.Mui-focused": {
          boxShadow: "0 0 0 3px rgba(14, 124, 107, 0.10)",
        },
      },
    },
  },

  MuiTextField: {
    defaultProps: {
      variant: "outlined",
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: "0.875rem",
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 600,
      },
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontSize: "0.75rem",
        lineHeight: 1.4,
        borderRadius: 8,
        padding: "7px 10px",
      },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
        backgroundImage: "none",
        boxShadow:
          "0 24px 64px rgba(0, 0, 0, 0.18), 0 4px 16px rgba(0, 0, 0, 0.08)",
      },
    },
  },

  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
        marginTop: 4,
        border: "1px solid var(--mui-menu-border)",
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
      },
    },
  },

  MuiMenuItem: {
    styleOverrides: {
      root: {
        borderRadius: 7,
        margin: "2px 4px",
        minHeight: 38,

        "&.Mui-selected": {
          backgroundColor: "rgba(14, 124, 107, 0.08)",
        },

        "&.Mui-selected:hover": {
          backgroundColor: "rgba(14, 124, 107, 0.12)",
        },
      },
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: "var(--mui-divider)",
      },
    },
  },
};

/* -------------------------------------------------------------------------- */
/* Light theme                                                                */
/* -------------------------------------------------------------------------- */

export const lightTheme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#0E7C6B",
      light: "#2FAF9D",
      dark: "#096353",
      contrastText: "#FFFFFF",
      lightBackground: "#EAF7F4",
    },

    secondary: {
      main: "#4B587A",
      light: "#687596",
      dark: "#35405D",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#F6F8F9",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#172126",
      secondary: "#66737A",
    },

    divider: "rgba(23, 33, 38, 0.08)",

    success: {
      main: "#249A68",
    },

    info: {
      main: "#3478C7",
    },

    warning: {
      main: "#C97818",
    },

    error: {
      main: "#D64545",
    },

    transparent: {
      main: "rgba(0, 0, 0, 0)",
    },
  },

  typography: commonTypography,

  shape: {
    borderRadius: 10,
  },

  components: {
    ...commonComponents,

    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--mui-card-border": "rgba(23, 33, 38, 0.07)",
          "--mui-card-shadow":
            "0 1px 2px rgba(23, 33, 38, 0.03), 0 4px 16px rgba(23, 33, 38, 0.04)",
          "--mui-menu-border": "rgba(23, 33, 38, 0.08)",
          "--mui-divider": "rgba(23, 33, 38, 0.08)",
        },

        body: {
          backgroundColor: "#F6F8F9",
        },

        "*": {
          boxSizing: "border-box",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.88)",
          color: "#172126",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(23, 33, 38, 0.07)",
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
        },
      },
    },
  },
});

/* -------------------------------------------------------------------------- */
/* Dark theme                                                                 */
/* -------------------------------------------------------------------------- */

export const darkTheme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#38B5A3",
      light: "#65D1C1",
      dark: "#218F80",
      contrastText: "#081513",
      lightBackground: "#163B36",
    },

    secondary: {
      main: "#9CAAD0",
      light: "#BBC6E1",
      dark: "#7C8AB0",
      contrastText: "#111522",
    },

    background: {
      default: "#0D1112",
      paper: "#151B1C",
    },

    text: {
      primary: "#EEF3F2",
      secondary: "#AAB7B5",
    },

    divider: "rgba(255, 255, 255, 0.09)",

    success: {
      main: "#4CCB8A",
    },

    info: {
      main: "#69A9F5",
    },

    warning: {
      main: "#F2A94E",
    },

    error: {
      main: "#F07878",
    },

    transparent: {
      main: "rgba(0, 0, 0, 0)",
    },
  },

  typography: commonTypography,

  shape: {
    borderRadius: 10,
  },

  components: {
    ...commonComponents,

    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--mui-card-border": "rgba(255, 255, 255, 0.07)",
          "--mui-card-shadow":
            "0 1px 2px rgba(0, 0, 0, 0.20), 0 8px 24px rgba(0, 0, 0, 0.16)",
          "--mui-menu-border": "rgba(255, 255, 255, 0.08)",
          "--mui-divider": "rgba(255, 255, 255, 0.09)",
        },

        body: {
          backgroundColor: "#0D1112",
        },

        "*": {
          boxSizing: "border-box",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(21, 27, 28, 0.88)",
          color: "#EEF3F2",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#151B1C",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#171E1F",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
        },

        head: {
          fontWeight: 600,
          color: "#AAB7B5",
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        thumb: {
          backgroundColor: "#38B5A3",
        },
      },
    },
  },
});
