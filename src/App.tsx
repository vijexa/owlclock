import { DateTimeFormatter, LocalTime } from '@js-joda/core';
import { Stack } from '@mui/material';
import OBR from '@owlbear-rodeo/sdk';
import React, { useEffect, useRef, useState } from 'react';
import { ClockRenderer } from './ClockRenderer';
import { Header } from './Header';
import { History } from './History';
import { TimeInput } from './TimeInput';
import { getLastReadChangelogVersion } from './changelog/changelog';
import { getSavedChangeDateOnTextInput, getSavedFavorites, getSavedHistorySize, getSavedIntegrateWithCalendar, getSavedTimeFormat, saveFavorites } from './settings/settings';
import { TimeFormat, Units, calculateDaysPassed, calculateDaysPassedOnTextInput, calculateNewTime, getFormatter } from './time';

const NAMESPACE_TIME = 'dev.vijexa.owlclock/time';
const NAMESPACE_CALENDAR_INTEGRATION = 'com.battle-system.calendar-integrate/data';

type TimeMetadata = {
  [NAMESPACE_TIME]: {
    time: string;
    verificationTimestamp: number;
  }
}

function saveTimeMetadata(time: LocalTime, calendarIncrement: number, integrateWithCalendar: boolean) {
  const owlclockMetadata: TimeMetadata = {
    [NAMESPACE_TIME]: {
      time: time.toString(),
      verificationTimestamp: Date.now()
    }
  };

  if (integrateWithCalendar) {
    return OBR.room.setMetadata({
      ...owlclockMetadata,
      [NAMESPACE_CALENDAR_INTEGRATION]: { Increment: calendarIncrement, Timestamp: Date.now() }
    });
  } else {
    return OBR.room.setMetadata(owlclockMetadata);
  }
}


function App() {
  const mainContainerRef = useRef(null);
  const contentContainerRef = useRef(null);

  const [time, setTime] = useState(LocalTime.parse('00:00'));
  const [lastVerificationTimestamp, setLastVerificationTimestamp] = useState(0);
  const [history, setHistory] = useState<History>([]);
  const [isGm, setIsGm] = useState<boolean>(false);
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(getSavedTimeFormat());
  const [historySize, setHistorySize] = useState(getSavedHistorySize());
  const [integrateWithCalendar, setIntegrateWithCalendar] = useState<boolean>(getSavedIntegrateWithCalendar());
  const [changeDateOnTextInput, setChangeDateOnTextInput] = useState<boolean>(getSavedChangeDateOnTextInput());
  const [lastReadChangelogVersion, setLastReadChangelogVersion] = useState<string>(getLastReadChangelogVersion());

  useEffect(
    () => initializeState(
      setTime,
      setHistory,
      setIsGm,
      setTimeFormat,
      setHistorySize,
      setIntegrateWithCalendar,
      setChangeDateOnTextInput,
      setLastReadChangelogVersion,
      mainContainerRef,
      contentContainerRef
    ),
    []
  );

  const formatter = getFormatter(timeFormat);

  useEffect(() => subscribeToTimeChanges(time, lastVerificationTimestamp, setLastVerificationTimestamp, setTime, formatter), [time, lastVerificationTimestamp, formatter]);

  const processTimeChangeCallback = getProcessTimeChangeCallback(time, history, setHistory, historySize, integrateWithCalendar);
  const processTimeSetCallback = processTimeSet(time, integrateWithCalendar, changeDateOnTextInput);

  return (
    <Stack ref={mainContainerRef} direction="column" height="100vh">
      <Header isGm={isGm} lastReadChangelogVersion={lastReadChangelogVersion} />
      <Stack
        ref={contentContainerRef}
        direction="column"
        spacing={2}
        sx={{
          padding: '16px',
          overflowY: 'auto',
          flexShrink: 1,
        }}
      >
        <ClockRenderer
          time={time}
          isEditable={isGm}
          formatter={formatter}
          onTimeChange={processTimeSetCallback}
          integrateWithCalendar={integrateWithCalendar}
          changeDateOnTextInput={changeDateOnTextInput}
        />
        {
          isGm
            ? <>
              <TimeInput time={time} onTimeChange={processTimeChangeCallback} />
              <History
                history={history}
                onFavorite={getProcessFavoriteCallback(history, setHistory)}
                onTimeChange={processTimeChangeCallback}
              />
            </>
            : <></>
        }
      </Stack >
    </Stack>
  )
}

export default App

// removing excess history while preserving favorites
// history can be overflowed by multiple elements if the historySize setting is reduced
function trimHistory(history: History, historySize: number): History {
  let needToRemove = history.length - historySize;

  return history.reduceRight<History>((acc, element) => {
    if (needToRemove > 0 && !element.isFavorite) {
      needToRemove--;
      return acc;
    } else {
      return [element, ...acc];
    }
  }, []);
}

function getProcessFavoriteCallback(history: History, setHistory: React.Dispatch<React.SetStateAction<History>>) {
  return (index: number, isFavorite: boolean) => {
    const element = history[index];
    const newElement = { ...element, isFavorite };
    const newHistory = [...history];
    newHistory.splice(index, 1, newElement)

    setHistory(newHistory);

    const favorites = newHistory.filter((element) => element.isFavorite);
    saveFavorites(favorites);
  }
}

function processTimeSet(time: LocalTime, integrateWithCalendar: boolean, changeDateOnTextInput: boolean) {
  return (newTime: LocalTime) => {
    const calendarIncrement = integrateWithCalendar && changeDateOnTextInput
      ? calculateDaysPassedOnTextInput(time, newTime)
      : 0;

    saveTimeMetadata(newTime, calendarIncrement, integrateWithCalendar).then(() => { });
  }
}

function getProcessTimeChangeCallback(time: LocalTime, history: History, setHistory: React.Dispatch<React.SetStateAction<History>>, historySize: number, integrateWithCalendar: boolean) {
  return (unit: Units, inputValue: number) => {
    const newTime = calculateNewTime(time, unit, inputValue);
    const calendarIncrement = integrateWithCalendar ? calculateDaysPassed(time, unit, inputValue) : 0;

    saveTimeMetadata(newTime, calendarIncrement, integrateWithCalendar).then(() => { });

    // check if the history already has this element to not override favorite status
    const index = history.findIndex((element) => element.unit === unit && element.inputValue === inputValue);
    const newHistory = index >= 0
      ? history
      : [...history, { unit, inputValue, isFavorite: false }];

    if (newHistory.length > historySize) {
      setHistory(trimHistory(newHistory, historySize));
    } else {
      setHistory(newHistory);
    }
  }
}

function subscribeToTimeChanges(
  time: LocalTime,
  lastVerificationTimestamp: number,
  setLastVerificationTimestamp: React.Dispatch<React.SetStateAction<number>>,
  setTime: React.Dispatch<React.SetStateAction<LocalTime>>,
  formatter: DateTimeFormatter
) {
  return OBR.room.onMetadataChange((rawMetadata) => {
    const timeMetadata = (rawMetadata as TimeMetadata)[NAMESPACE_TIME];


    if (timeMetadata) {
      if (time.toString() !== timeMetadata.time && timeMetadata.verificationTimestamp > lastVerificationTimestamp) {
        const parsedTime = LocalTime.parse(timeMetadata.time);

        setTime(parsedTime);
        setLastVerificationTimestamp(timeMetadata.verificationTimestamp);

        OBR.notification.show('You feel the passage of time... ' + parsedTime.format(formatter));
      }
    }
  });
}

function initializeState(
  setTime: React.Dispatch<React.SetStateAction<LocalTime>>,
  setHistory: React.Dispatch<React.SetStateAction<History>>,
  setIsGm: React.Dispatch<React.SetStateAction<boolean>>,
  setTimeFormat: React.Dispatch<React.SetStateAction<TimeFormat>>,
  setHistorySize: React.Dispatch<React.SetStateAction<number>>,
  setIntegrateWithCalendar: React.Dispatch<React.SetStateAction<boolean>>,
  setChangeDateOnTextInput: React.Dispatch<React.SetStateAction<boolean>>,
  setLastReadChangelogVersion: React.Dispatch<React.SetStateAction<string>>,
  mainContainerRef: React.RefObject<HTMLDivElement>,
  contentContainerRef: React.RefObject<HTMLDivElement>
) {
  // resize extension window when the content changes
  const resizeObserver = new ResizeObserver(() => {
    let totalHeight = 0;
    mainContainerRef.current?.childNodes.forEach((element) => {
      totalHeight += (element as HTMLElement).scrollHeight;
    })

    OBR.action.setHeight(totalHeight + 1);
  });

  resizeObserver.observe(contentContainerRef.current!);

  OBR.room.getMetadata().then((rawMetadata) => {
    // get initial time
    const timeMetadata = (rawMetadata as TimeMetadata)[NAMESPACE_TIME];

    if (timeMetadata) {
      setTime(LocalTime.parse(timeMetadata.time));
    }

    // get initial favorites
    const favorites = getSavedFavorites();

    if (favorites) {
      setHistory(favorites);
    }
  });

  // check if player is a gm
  OBR.player.getRole().then((role) => {
    if (role === 'GM') {
      setIsGm(true);
    }
  });

  // subscribe to settings changes
  window.addEventListener("storage", function () {
    setTimeFormat(getSavedTimeFormat());
    setHistorySize(getSavedHistorySize());
    setIntegrateWithCalendar(getSavedIntegrateWithCalendar());
    setChangeDateOnTextInput(getSavedChangeDateOnTextInput());
    setLastReadChangelogVersion(getLastReadChangelogVersion());
  });


  return () => resizeObserver.unobserve(document.body);
}

