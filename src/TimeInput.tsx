
import { LocalTime } from "@js-joda/core";
import { Button, ButtonGroup, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { Units } from "./time";

interface TimeInputProps {
  time: LocalTime;
  onTimeChange: (unit: Units, value: number) => void;

}

export function TimeInput({ onTimeChange }: TimeInputProps) {

  const [inputValue, setInputValue] = useState(1);

  const addTime = (unit: Units) => () => {
    onTimeChange(unit, inputValue);
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <TextField
          id="outlined-basic"
          variant="outlined"
          type="number"
          size="small"
          label="Add"
          sx={{
            width: '80px',
          }}
          value={inputValue}
          onChange={(event) => setInputValue(parseInt(event.target.value))}
        />
        <ButtonGroup variant="outlined">
          <Button onClick={addTime('hours')}>Hours</Button>
          <Button onClick={addTime('minutes')}>Minutes</Button>
        </ButtonGroup>
      </Stack>
    </>
  );
}
