import { HelpOutline } from "@mui/icons-material";
import { Box, Button, CardActions, CardContent, FormControl, FormLabel, IconButton, Slider, Switch, ToggleButton, ToggleButtonGroup, Tooltip, styled } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import OBR from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ModalCard } from "../modal/ModalCard";
import { SETTINGS_MODAL_ID } from "../modal/modal";
import { TimeFormat } from "../time";
import { getSavedChangeDateOnTextInput, getSavedHistorySize, getSavedIntegrateWithCalendar, getSavedTimeFormat, saveSetttings } from "./settings";

const RowFormControl = styled(FormControl)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '8px',
});
const StyledFormLabel = styled(FormLabel)({ marginBottom: '8px' });
const StyledToggleButton = styled(ToggleButton)({ paddingLeft: '12px', paddingRight: '12px' });
const CenteredCardActions = styled(CardActions)({ justifyContent: 'center' });

export function SettingsPage() {
  const [searchParams] = useSearchParams();
  const [isGm, setIsGm] = useState<boolean>(searchParams.get('isGm') === 'true');

  const [timeFormat, setTimeFormat] = useState<TimeFormat>(getSavedTimeFormat());
  const [historySize, setHistorySize] = useState(getSavedHistorySize());
  const [integrateWithCalendar, setIntegrateWithCalendar] = useState<boolean>(getSavedIntegrateWithCalendar());
  const [changeDateOnTextInput, setChangeDateOnTextInput] = useState<boolean>(getSavedChangeDateOnTextInput());

  useEffect(() => {
    if (!integrateWithCalendar) {
      setChangeDateOnTextInput(false);
    }
  }, [integrateWithCalendar]);

  useEffect(() => {
    // confirm gm status
    OBR.player.getRole().then(role => setIsGm(role === 'GM'));
  }, []);

  function processTimeFormatChange(_: React.MouseEvent<HTMLElement>, value: TimeFormat | null) {
    const newValue = value ?? TimeFormat.H24;
    setTimeFormat(newValue);
  }

  return (
    <ModalCard modalId={SETTINGS_MODAL_ID}>
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
        <FormControl fullWidth>
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
        </FormControl>

        {
          isGm
            ? <>
              <FormControl fullWidth>
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
              </FormControl>
              <RowFormControl fullWidth>
                <Switch checked={integrateWithCalendar} onChange={e => setIntegrateWithCalendar(e.target.checked)} />
                <FormLabel focused={false}>Integrate with "Calendar!"?</FormLabel>
              </RowFormControl>
              <RowFormControl fullWidth disabled={!integrateWithCalendar}>
                <Switch checked={changeDateOnTextInput} onChange={e => setChangeDateOnTextInput(e.target.checked)} />
                <FormLabel focused={false}>Change date on text input?</FormLabel>
                <Tooltip arrow title="This option enables date change also on text input. It will assume that if you enter time before current time, you must mean the next day. A hint will appear when applying the time will advance the date. Example: entering 8:00 when current time is 23:00 will trigger date change.">
                  <IconButton>
                    <HelpOutline></HelpOutline>
                  </IconButton>
                </Tooltip>
              </RowFormControl>
            </>
            : <></>
        }
      </CardContent>

      <CenteredCardActions >
        <Button variant="outlined" onClick={() => onSaveClick(timeFormat, historySize, integrateWithCalendar, changeDateOnTextInput)}>
          Save
        </Button>
      </CenteredCardActions>
    </ModalCard >
  );
}

function onSaveClick(timeFormat: TimeFormat, historySize: number, integrateWithCalendar: boolean, changeDateOnTextInput: boolean) {
  saveSetttings(timeFormat, historySize, integrateWithCalendar, changeDateOnTextInput);
  OBR.modal.close(SETTINGS_MODAL_ID);
}
