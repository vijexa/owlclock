import { History } from "../History";
import { TimeFormat } from "../time";

export const TIME_FORMAT_KEY = 'timeFormat';
export const HISTORY_SIZE_KEY = 'historySize';
export const FAVORITES_KEY = 'favorites';

export function getSavedTimeFormat(): TimeFormat {
  const storedTimeFormat = localStorage.getItem(TIME_FORMAT_KEY);
  if (storedTimeFormat === TimeFormat.H12 || storedTimeFormat === TimeFormat.H24) {
    return storedTimeFormat;
  } else {
    const locale = navigator.language;
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

export function getSavedFavorites(): History {
  const storedFavorites = localStorage.getItem(FAVORITES_KEY);
  if (storedFavorites) {
    try {
      const parsed = JSON.parse(storedFavorites);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      return [];
    }
  }

  return [];
}

export function saveFavorites(favorites: History) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function saveSetttings(timeFormat: TimeFormat, historySize: number) {
  localStorage.setItem(TIME_FORMAT_KEY, timeFormat);
  localStorage.setItem(HISTORY_SIZE_KEY, historySize.toString());
}
