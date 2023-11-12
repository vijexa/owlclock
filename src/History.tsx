import { FavoriteBorder } from "@mui/icons-material";
import { Button, ButtonGroup, Stack } from "@mui/material";
import { Units } from "./timeUnits";

export type HistoryElement = {
  unit: Units;
  inputValue: number;
  isFavorite: boolean;
}

export type History = HistoryElement[];

interface HistoryProps {
  history: History;
  onTimeChange: (unit: Units, value: number) => void;
  onFavorite: (index: number, isFavorite: boolean) => void;
}

export function History({ history, onTimeChange, onFavorite }: HistoryProps) {

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        useFlexGap
        spacing={1}
      >
        {
          history.map((element, index) => {
            return (
              <ButtonGroup
                key={index}
                size="small"
                variant="outlined"
              >
                <Button
                  sx={{ width: 'fit-content' }}
                  onClick={() => onTimeChange(element.unit, element.inputValue)}
                >
                  {element.inputValue} {element.unit[0]}
                </Button>
                <Button
                  variant={element.isFavorite ? 'contained' : 'outlined'}
                  onClick={
                    () => onFavorite(index, !element.isFavorite)
                  }
                >
                  <FavoriteBorder fontSize="small"></FavoriteBorder>
                </Button>
              </ButtonGroup>
            )
          })
        }
      </Stack>
    </>
  );
}
