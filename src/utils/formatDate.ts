import { getAppNow } from './getAppNow';

const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
] as const;

const DOW = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'] as const;
const DOW_FULL = [
  'воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота',
] as const;

export function formatTimeMinutes(m: number): string {
  return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
}

export function formatMonthName(monthIndex: number): string {
  return MONTHS[monthIndex] ?? '';
}

export function formatDow(day: number): string {
  return DOW[day] ?? '';
}

export function formatDowFull(day: number): string {
  return DOW_FULL[day] ?? '';
}

export function formatPrototypeTodayLabel(): string {
  const d = getAppNow();
  return `${formatDowFull(d.getDay())}, ${d.getDate()} ${formatMonthName(d.getMonth())}`;
}
