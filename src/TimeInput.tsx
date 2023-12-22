
import { LocalTime } from "@js-joda/core";
import { Button, ButtonGroup, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { Units } from "./time";

interface TimeInputProps {
  time: LocalTime;
  onTimeChange: (unit: Units, value: number) => void;

}

export function TimeInput({ onTimeChange }: TimeInputProps) {

  const [inputValue, setInputValue] = useState('1');
  const [prevValue, setPrevValue] = useState('1');

  const addTime = (unit: Units) => () => {
    onTimeChange(unit, parseInt(inputValue));
  };


  // making sure there is a valid value on blur
  function onFieldBlur() {
    const parsedValue = parseInt(inputValue);
    if (isNaN(parsedValue) || parsedValue === 0) {
      setInputValue(prevValue);
    } else {
      // format the value to remove leading zeroes (if any)
      const asString = parsedValue.toString();
      setPrevValue(asString);
      setInputValue(asString);
    }
  }

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        rowGap="8px"
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
          onChange={(event) => setInputValue(event.target.value)}
          onBlur={onFieldBlur}
        />
        <ButtonGroup variant="outlined">
          <Button onClick={addTime('hours')}>Hours</Button>
          <Button onClick={addTime('minutes')}>Minutes</Button>
        </ButtonGroup>
      </Stack>
    </>
  );
}


