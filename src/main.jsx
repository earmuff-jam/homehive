import { Suspense } from "react";

import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import "./main.css";
import { store } from "./store";
import { CssBaseline, Dialog } from "@mui/material";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <CssBaseline />
    <Suspense fallback={<Dialog open={false} title="Loading..." />}>
      <App />
    </Suspense>
  </Provider>,
);
