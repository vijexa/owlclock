

import { DateTimeFormatter, LocalTime } from "@js-joda/core";
import { Box, TextField, Typography } from "@mui/material";
import { KeyboardEvent, useEffect, useState } from "react";
import { calculateDaysPassedOnTextInput } from "./time";

interface ClockRendererProps {
  time: LocalTime;
  isEditable: boolean;
  formatter: DateTimeFormatter;
  onTimeChange: (time: LocalTime) => void;
  integrateWithCalendar: boolean;
  changeDateOnTextInput: boolean;
}


export function ClockRenderer({ time, isEditable, formatter, onTimeChange, integrateWithCalendar, changeDateOnTextInput }: ClockRendererProps) {
  const timeString = time.format(formatter);
  const [timeEditorValue, setTimeEditorValue] = useState<string>(timeString);
  const [helperText, setHelperText] = useState<string>('');

  useEffect(() => {
    setTimeEditorValue(time.format(formatter));
  }, [time, formatter]);

  function onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setTimeEditorValue(value);

    if (integrateWithCalendar && changeDateOnTextInput) {
      try {
        if (calculateDaysPassedOnTextInput(time, parseTime(value, formatter)) !== 0) {
          setHelperText('Date will be set to tomorrow');
        } else {
          setHelperText('');
        }
      } catch {
        setHelperText('');
      }
    }
  }

  function onTimeChangeCaller() {
    try {
      const newTime = parseTime(timeEditorValue, formatter);
      onTimeChange(newTime);
      setHelperText('');
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
              onChange={onValueChange}
              onBlur={onTimeChangeCaller}
              onKeyDown={onKeyDownHandler}
              helperText={helperText}
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

function parseTime(timeEditorValue: string, formatter: DateTimeFormatter) {
  const formattedTime = timeEditorValue.toUpperCase();
  const newTime = LocalTime.parse(formattedTime, formatter);
  return newTime;
}
