import { DateTimeFormatter, LocalTime } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en-us";

export type Units = 'hours' | 'minutes';

export const unitToMinutes: Record<Units, number> = {
  'hours': 60,
  'minutes': 1,
};

export function calculateNewTime(time: LocalTime, unit: Units, inputValue: number) {
  const minutesToAdd = unitToMinutes[unit] * inputValue;
  return time.plusMinutes(minutesToAdd);
}

export enum TimeFormat { H12 = '24h', H24 = '12h' }

export const FORMATTTER_12H = DateTimeFormatter.ofPattern('h:mm[ ]a').withLocale(Locale.US);
export const FORMATTTER_24H = DateTimeFormatter.ofPattern('H:mm');

export function getFormatter(timeFormat: TimeFormat) {
  return timeFormat === TimeFormat.H24 ? FORMATTTER_24H : FORMATTTER_12H;
}
