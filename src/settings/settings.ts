import { TimeFormat } from "../time";

export const TIME_FORMAT_KEY = 'timeFormat';
export const HISTORY_SIZE_KEY = 'historySize';

export function getSavedTimeFormat(): TimeFormat {
  const storedTimeFormat = localStorage.getItem(TIME_FORMAT_KEY);
  if (storedTimeFormat === TimeFormat.H12 || storedTimeFormat === TimeFormat.H24) {
    return storedTimeFormat;
  } else {
    const locale = navigator.language;
    console.log('settings not found, assuming from locale: ', locale);
    return Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hour12
      ? TimeFormat.H12
      : TimeFormat.H24;
  }
}

export function getSavedHistorySize(): number {
  const storedHistorySize = localStorage.getItem(HISTORY_SIZE_KEY);
  if (storedHistorySize) {
    const parsed = parseInt(storedHistorySize);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  return 5;
}

export function saveSetttings(timeFormat: TimeFormat, historySize: number) {
  localStorage.setItem(TIME_FORMAT_KEY, timeFormat);
  localStorage.setItem(HISTORY_SIZE_KEY, historySize.toString());
}
