import { LocalTime } from '@js-joda/core';
import { Stack } from '@mui/material';
import OBR from '@owlbear-rodeo/sdk';
import { useEffect, useState } from 'react';
import { ClockRenderer } from './ClockRenderer';
import { Header } from './Header';
import { History } from './History';
import { TimeInput } from './TimeInput';
import { Units, calculateNewTime } from './timeUnits';

const NAMESPACE = 'com.github.vijexa.owlclock';

type OwlClockMetadata = {
  [NAMESPACE]: OwlClockMetadataBody;
}

type OwlClockMetadataBody = {
  time: string;
  favorites: History
}

function saveMetadata(time: LocalTime, favorites: History = []) {
  return OBR.room.setMetadata({
    'com.github.vijexa.owlclock': {
      time: time.toString(),
      favorites
    }
  });
}

function App() {
  const [time, setTime] = useState(LocalTime.parse('00:00'));
  const [history, setHistory] = useState<History>([]);
  const [previousMetadata, setPreviousMetadata] = useState<OwlClockMetadataBody>();
  const [isGm, setIsGm] = useState<boolean>(false);

  // initialize state
  useEffect(() => {
    // get initial metadata and set time and favorites
    OBR.room.getMetadata().then((rawMetadata) => {
      const metadata = (rawMetadata as OwlClockMetadata)[NAMESPACE];

      console.log('first run');
      setHistory(metadata.favorites);
      setTime(LocalTime.parse(metadata.time));
    });

    // check if player is a gm
    OBR.player.getRole().then((role) => {
      if (role === 'GM') {
        console.log('player is a gm!')
        setIsGm(true);
      }
    })
  }, []);

  useEffect(() => {
    console.log('effect');

    return OBR.room.onMetadataChange((rawMetadata) => {
      console.log('metadata changed', rawMetadata);
      const metadata = (rawMetadata as OwlClockMetadata)[NAMESPACE];

      if (metadata) {
        console.log('metadata', metadata)

        if (time.toString() !== metadata.time) {
          console.log(time.toString(), metadata.time);
          setTime(LocalTime.parse(metadata.time));

          OBR.notification.show('You feel the passage of time... ' + metadata.time);

          setPreviousMetadata(metadata);
        }
      }
    })
  },
    [time, previousMetadata]
  )

  function processTimeChange(unit: Units, inputValue: number) {
    const newTime = calculateNewTime(time, unit, inputValue);
    saveMetadata(newTime, previousMetadata?.favorites).then(() => { });
    // check if the history already has this element to not override favorite status
    //const newHistory = history.has({ unit, inputValue }) ? history : history.set({ unit, inputValue }, false);
    const index = history.findIndex((element) => element.unit === unit && element.inputValue === inputValue);
    console.log('index', index);
    const newHistory = index >= 0
      ? history
      : [...history, { unit, inputValue, isFavorite: false }];

    if (newHistory.length > 6) {
      const indexToDelete = newHistory.findIndex((element) => element.isFavorite === false);
      newHistory.splice(indexToDelete, 1);
    }


    console.log('new history', newHistory);
    setHistory(newHistory);
  }

  function processTimeSet(newTime: LocalTime) {
    saveMetadata(newTime, previousMetadata?.favorites).then(() => { });
  }

  function processFavorite(index: number, isFavorite: boolean) {
    console.log('processFavorite', index, isFavorite, history);
    const element = history[index];
    const newElement = { ...element, isFavorite };
    console.log('elements', element, newElement)
    const newHistory = [...history];
    newHistory.splice(index, 1, newElement)

    setHistory(newHistory);

    const favorites = newHistory.filter((element) => element.isFavorite);
    saveMetadata(time, favorites).then(() => { });
  }

  console.log('app rendered', time.toString());

  return (
    <>
      <Header></Header>
      <Stack
        direction="column"
        spacing={2}
        sx={{
          marginTop: '16px',
        }}
      >
        <ClockRenderer time={time} isEditable={isGm} onTimeChange={processTimeSet}></ClockRenderer>
        {
          isGm
            ? <>
              <TimeInput time={time} onTimeChange={processTimeChange} ></TimeInput>
              <History history={history} onFavorite={processFavorite} onTimeChange={processTimeChange} ></History>
            </>
            : <></>
        }
      </Stack>
    </>
  )
}

export default App
