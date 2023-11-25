import { Box, Button, Card, CardActions, CardContent, FormControl, FormLabel, Slider, ToggleButton, ToggleButtonGroup, styled } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import OBR from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";
import { TimeFormat } from "../time";
import { getSavedHistorySize, getSavedTimeFormat, saveSetttings } from "./settings";

const StyledFormControl = styled(FormControl)({});
const StyledFormLabel = styled(FormLabel)({ marginBottom: '8px' });
const StyledToggleButton = styled(ToggleButton)({ paddingLeft: '12px', paddingRight: '12px' });
const CenteredCardActions = styled(CardActions)({ justifyContent: 'center' });

export function SettingsPage() {
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(getSavedTimeFormat());
  const [historySize, setHistorySize] = useState(getSavedHistorySize());
  const [isGm, setIsGm] = useState<boolean>(false);

  useEffect(() => {
    OBR.player.getRole().then(role => setIsGm(role === 'GM'));
  }, []);

  function processTimeFormatChange(_: React.MouseEvent<HTMLElement>, value: TimeFormat | null) {
    const newValue = value ?? TimeFormat.H24;
    setTimeFormat(newValue);
  }

  return (
    <>
      <Card sx={{ boxShadow: "none" }}>
        <CardHeader
          title="OwlClock🦉 Settings"
          titleTypographyProps={{
            sx: {
              fontSize: "1.125rem",
              fontWeight: "bold",
              lineHeight: "32px",
              color: "text.primary",
            },
          }}
        />
        <Divider variant="middle" />
        <CardContent style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <StyledFormControl fullWidth>
            <StyledFormLabel>Time Format</StyledFormLabel>
            <ToggleButtonGroup
              exclusive
              size="small"
              fullWidth
              color="primary"
              value={timeFormat}
              onChange={processTimeFormatChange}
            >
              <StyledToggleButton value={TimeFormat.H24}>
                24h
              </StyledToggleButton>
              <StyledToggleButton value={TimeFormat.H12}>
                12h
              </StyledToggleButton>
            </ToggleButtonGroup>
          </StyledFormControl>

          {
            isGm
              ? <StyledFormControl fullWidth>
                <StyledFormLabel>History Size</StyledFormLabel>
                <Box padding='0 8px'>
                  <Slider
                    value={historySize}
                    marks
                    min={1}
                    max={10}
                    valueLabelDisplay="auto"
                    onChange={(_, value) => setHistorySize(value as number)}
                  />
                </Box>
              </StyledFormControl>
              : <></>
          }
        </CardContent>

        <CenteredCardActions >
          <Button variant="outlined" onClick={() => onSaveClick(timeFormat, historySize)}>
            Save
          </Button>
        </CenteredCardActions>
      </Card >
    </>
  );
}

function onSaveClick(timeFormat: TimeFormat, historySize: number) {
  saveSetttings(timeFormat, historySize);
  OBR.modal.close("com.github.vijexa.owlclock/settingsModal");
}
