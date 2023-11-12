import { LocalTime } from "@js-joda/core";

export type Units = 'hours' | 'minutes';

export const unitToMinutes: Record<Units, number> = {
  'hours': 60,
  'minutes': 1,
};

export function calculateNewTime(time: LocalTime, unit: Units, inputValue: number) {
  const minutesToAdd = unitToMinutes[unit] * inputValue;
  return time.plusMinutes(minutesToAdd);
}
