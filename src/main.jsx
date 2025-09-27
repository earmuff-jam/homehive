import React, { Suspense } from "react";

import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import "./main.css";
import { store } from "./store";
import { CssBaseline, Dialog, ThemeProvider } from "@mui/material";
import { lightTheme } from "common/Theme";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Suspense fallback={<Dialog open={false} title="Loading..." />}>
        <App />
      </Suspense>
    </ThemeProvider>
  </Provider>,
);
