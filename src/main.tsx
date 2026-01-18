import { Suspense } from "react";

import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import "./main.css";
import { store } from "./store";
import { Box, CircularProgress } from "@mui/material";

const rootElement = document.getElementById("root") as HTMLElement;

createRoot(rootElement).render(
  <Provider store={store}>
    <Suspense
      fallback={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      }
    >
      <App />
    </Suspense>
  </Provider>,
);
