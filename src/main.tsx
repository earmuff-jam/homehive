import { Suspense } from "react";

import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import "./main.css";
import { store } from "./store";

const rootElement = document.getElementById("root") as HTMLElement;

createRoot(rootElement).render(
  <Provider store={store}>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </Provider>,
);
