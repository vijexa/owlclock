

import { DateTimeFormatter, LocalTime } from "@js-joda/core";
import { Box, TextField, Typography } from "@mui/material";
import { KeyboardEvent, useEffect, useState } from "react";

interface ClockRendererProps {
  time: LocalTime;
  isEditable: boolean;
  formatter: DateTimeFormatter;
  onTimeChange: (time: LocalTime) => void;
}


export function ClockRenderer({ time, isEditable, formatter, onTimeChange }: ClockRendererProps) {
  const timeString = time.format(formatter);
  const [timeEditorValue, setTimeEditorValue] = useState<string>(timeString);

  useEffect(() => {
    setTimeEditorValue(time.format(formatter));
  }, [time, formatter]);

  function onTimeChangeCaller() {
    try {
      const formattedTime = timeEditorValue.toUpperCase();
      const newTime = LocalTime.parse(formattedTime, formatter);
      onTimeChange(newTime);
    } catch {
      setTimeEditorValue(time.format(formatter));
    }
  }

  function onKeyDownHandler(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      //@ts-expect-error typing issue in react 
      event.target.blur();
    }
  }

  return (
    <>
      {
        isEditable
          ? <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              variant="standard"
              value={timeEditorValue}
              sx={{
                marginBottom: '16px',
                width: '210px',
                '& input': {
                  textAlign: 'center',
                  fontSize: '3rem',
                },

              }}
              onChange={e => setTimeEditorValue(e.target.value)}
              onBlur={onTimeChangeCaller}
              onKeyDown={onKeyDownHandler}
            />
          </Box>
          : <Typography
            variant="h3"
            align="center"
            color='text.primary'
          >
            {timeString}
          </Typography>
      }
    </>
  );
}
