import { LocalTime } from '@js-joda/core';
import { Stack } from '@mui/material';
import OBR from '@owlbear-rodeo/sdk';
import { useEffect, useState } from 'react';
import { ClockRenderer } from './ClockRenderer';
import { Header } from './Header';
import { History } from './History';
import { TimeInput } from './TimeInput';
import { Units, calculateNewTime } from './timeUnits';

const NAMESPACE_TIME = 'com.github.vijexa.owlclock/time';
const NAMESPACE_FAVORITES = 'com.github.vijexa.owlclock/favorites';

function getFavoritesNamespace() {
  return NAMESPACE_FAVORITES + '@' + OBR.player.id;
}

type TimeMetadata = {
  [NAMESPACE_TIME]: {
    time: string;
  }
}

function saveTimeMetadata(time: LocalTime) {
  return OBR.room.setMetadata({
    [NAMESPACE_TIME]: {
      time: time.toString()
    }
  });
}

type FavoritesMetadata = {
  [key: string]: {
    favorites: History;
  }
}

function saveFavoritesMetadata(favorites: History) {
  return OBR.room.setMetadata({
    [getFavoritesNamespace()]: {
      favorites: favorites
    }
  });
}

function App() {
  const [time, setTime] = useState(LocalTime.parse('00:00'));
  const [history, setHistory] = useState<History>([]);
  const [isGm, setIsGm] = useState<boolean>(false);

  // initialize state
  useEffect(() => {
    // resize extension window when the content changes
    const resizeObserver = new ResizeObserver(entries => {
      entries.map((entry) => {
        // adding 16px for padding
        const newHeight = entry.contentRect.height + 16;
        OBR.action.setHeight(newHeight);
      });
    });

    resizeObserver.observe(document.body);

    OBR.room.getMetadata().then((rawMetadata) => {
      // get initial time
      const timeMetadata = (rawMetadata as TimeMetadata)[NAMESPACE_TIME];

      if (timeMetadata) {
        setTime(LocalTime.parse(timeMetadata.time));
      }

      // get initial favorites
      const favoritesMetadata = (rawMetadata as FavoritesMetadata)[getFavoritesNamespace()];

      if (favoritesMetadata) {
        setHistory(favoritesMetadata.favorites);
      }
    });

    // check if player is a gm
    OBR.player.getRole().then((role) => {
      if (role === 'GM') {
        setIsGm(true);
      }
    })

    return () => resizeObserver.unobserve(document.body);
  }, []);

  useEffect(() => {
    return OBR.room.onMetadataChange((rawMetadata) => {
      const timeMetadata = (rawMetadata as TimeMetadata)[NAMESPACE_TIME];

      if (timeMetadata) {

        if (time.toString() !== timeMetadata.time) {
          console.log(time.toString(), timeMetadata.time);
          setTime(LocalTime.parse(timeMetadata.time));

          OBR.notification.show('You feel the passage of time... ' + timeMetadata.time);
        }
      }
    })
  },
    [time]
  )

  function processTimeChange(unit: Units, inputValue: number) {
    const newTime = calculateNewTime(time, unit, inputValue);
    saveTimeMetadata(newTime).then(() => { });

    // check if the history already has this element to not override favorite status
    const index = history.findIndex((element) => element.unit === unit && element.inputValue === inputValue);
    const newHistory = index >= 0
      ? history
      : [...history, { unit, inputValue, isFavorite: false }];

    if (newHistory.length > 6) {
      const indexToDelete = newHistory.findIndex((element) => element.isFavorite === false);
      newHistory.splice(indexToDelete, 1);
    }

    setHistory(newHistory);
  }

  function processTimeSet(newTime: LocalTime) {
    saveTimeMetadata(newTime).then(() => { });
  }

  function processFavorite(index: number, isFavorite: boolean) {
    const element = history[index];
    const newElement = { ...element, isFavorite };
    const newHistory = [...history];
    newHistory.splice(index, 1, newElement)

    setHistory(newHistory);

    const favorites = newHistory.filter((element) => element.isFavorite);
    saveFavoritesMetadata(favorites).then(() => { });
  }

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
