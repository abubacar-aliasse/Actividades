import { addDays, format } from 'date-fns';

const INPUT_FORMAT = 'yyyy-MM-dd';

export function toInputDate(value: Date | string | null | undefined) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return format(date, INPUT_FORMAT);
}

export function addDaysInput(value: Date | string, days: number) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return format(addDays(date, days), INPUT_FORMAT);
}
