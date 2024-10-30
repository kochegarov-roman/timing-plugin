import React from "react";
import ReactDOM from "react-dom/client";
import Plugin from "./Plugin.tsx";
import store from "./store/store.ts";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("schedule-app-root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Plugin />
    </Provider>
  </React.StrictMode>,
);
