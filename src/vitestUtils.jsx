import React from "react";

import { ThemeProvider } from "@mui/material";
import { render } from "@testing-library/react";
import { lightTheme } from "src/Theme";

// renderWithTheme ...
// defines a function that allows component to be rendered with theme
export const renderWithTheme = (wrappedComponent) =>
  render(<ThemeProvider theme={lightTheme}>{wrappedComponent}</ThemeProvider>);
