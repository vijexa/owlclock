// this whole file is humbly stolen from https://github.com/owlbear-rodeo/initiative-tracker/blob/main/src/PluginGate.tsx

import OBR from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";

/**
 * Only render the children when we're within a plugin
 * and that plugin is ready.
 */
export function PluginGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (OBR.isAvailable) {
      OBR.onReady(() => setReady(true));
    }
  }, []);

  if (ready) {
    return <>{children}</>;
  } else {
    return null;
  }
}
