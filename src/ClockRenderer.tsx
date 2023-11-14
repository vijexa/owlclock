
import { LocalTime } from "@js-joda/core";
import { Box, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface ClockRendererProps {
  time: LocalTime;
  isEditable: boolean;
  onTimeChange: (time: LocalTime) => void;
}


export function ClockRenderer({ time, isEditable, onTimeChange }: ClockRendererProps) {
  const [timeEditorValue, setTimeEditorValue] = useState<string>(time.toString());
  // date rendered as 24-hour time in HH:MM format
  const timeString = time.toString();

  useEffect(() => {
    setTimeEditorValue(time.toString());
  }, [time]);

  function onTimeChangeCaller(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    try {
      const newTime = LocalTime.parse(event.target.value);
      onTimeChange(newTime);
    } catch {
      setTimeEditorValue(time.toString());
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
                width: '200px',
                '& input': {
                  textAlign: 'center',
                  fontSize: '3rem',
                },

              }}
              onChange={e => setTimeEditorValue(e.target.value)}
              onBlur={onTimeChangeCaller}
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
