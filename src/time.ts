import { ChronoUnit, DateTimeFormatter, LocalDate, LocalDateTime, LocalTime } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en-us";

export type Units = 'hours' | 'minutes';

export const unitToMinutes: Record<Units, number> = {
  'hours': 60,
  'minutes': 1,
};

export function calculateNewTime(time: LocalTime, unit: Units, inputValue: number) {
  const minutesToAdd = calculateMinutes(unit, inputValue);
  return time.plusMinutes(minutesToAdd);
}

export function calculateMinutes(unit: Units, inputValue: number): number {
  return unitToMinutes[unit] * inputValue;
}

export function calculateDaysPassed(time: LocalTime, unit: Units, inputValue: number): number {
  const oldLocalDateTime = LocalDateTime.of(LocalDate.ofEpochDay(0), time);
  const minutesPassed = calculateMinutes(unit, inputValue);
  const newLocalDateTime = oldLocalDateTime.plusMinutes(minutesPassed);
  const daysBetween = ChronoUnit.DAYS.between(oldLocalDateTime.toLocalDate(), newLocalDateTime.toLocalDate());

  return daysBetween;
}


export function calculateDaysPassedOnTextInput(time: LocalTime, newTime: LocalTime) {
  // assuming that if time set is before current time, then it's the next day
  if (newTime.isBefore(time)) {
    return 1;
  }

  return 0;
}

export enum TimeFormat { H12 = '24h', H24 = '12h' }

export const FORMATTTER_12H = DateTimeFormatter.ofPattern('h:mm[ ]a').withLocale(Locale.US);
export const FORMATTTER_24H = DateTimeFormatter.ofPattern('H:mm');

export function getFormatter(timeFormat: TimeFormat) {
  return timeFormat === TimeFormat.H24 ? FORMATTTER_24H : FORMATTTER_12H;
}

