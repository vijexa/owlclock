import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import { InfoPage } from "./info/InfoPage";
import { PluginGate } from "./PluginGate";
import { PluginThemeProvider } from "./PluginThemeProvider";
import { SettingsPage } from "./settings/SettingsPage";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/info",
    element: <InfoPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
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

const unused = 0;
