// this whole file is humbly stolen from https://github.com/owlbear-rodeo/initiative-tracker/blob/main/src/PluginGate.tsx

import { Box, Typography } from "@mui/material";
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
    return <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ backgroundColor: '#0d1117' }}
    >
      <Typography fontSize="1.5rem" color="#c9d1d9">
        This is not a standalone website, but an extension
        for <a href="https://owlbear.rodeo">owlbear.rodeo</a> VTT.
        More info <a href="https://github.com/vijexa/owlclock">here</a>.
        Extension manifest <a href="./manifest.json">here</a>.
      </Typography>
    </Box>;
  }
}