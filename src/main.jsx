import React, { Suspense } from "react";

import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import "./main.css";
import { store } from "./store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Suspense>
      <App />
    </Suspense>
  </Provider>,
);
