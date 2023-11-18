import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import { InfoPage } from "./InfoPage";
import { PluginGate } from "./PluginGate";
import { PluginThemeProvider } from "./PluginThemeProvider";

const router = createBrowserRouter([
  {
    path: "/owlclock",
    element: <App />,
  },
  {
    path: "/owlclock/info",
    element: <InfoPage />,
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PluginGate>
      <PluginThemeProvider>
        <RouterProvider router={router} />
      </PluginThemeProvider>
    </PluginGate>
  </React.StrictMode>
);
