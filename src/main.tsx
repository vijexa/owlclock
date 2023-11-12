import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
import { PluginGate } from "./PluginGate";
import { PluginThemeProvider } from "./PluginThemeProvider";
import OBR from "@owlbear-rodeo/sdk";

const resizeObserver = new ResizeObserver(entries => {
  entries.map((entry) => {
    // adding 16px for padding
    console.log('resizing...')
    const newHeight = entry.contentRect.height + 16;
    OBR.action.setHeight(newHeight);
  });
});

resizeObserver.observe(document.body);


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PluginGate>
      <PluginThemeProvider>
        <App />
      </PluginThemeProvider>
    </PluginGate>
  </React.StrictMode>
);
