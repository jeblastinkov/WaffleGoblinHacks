import { format, subDays, addDays, differenceInDays } from 'date-fns';

/**
 * Returns today's date at midnight UTC
 */
export function getTodayDate(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/**
 * Returns formatted date string
 */
export function formatDate(date: Date, formatStr: string = 'MMMM d, yyyy'): string {
  return format(date, formatStr);
}

/**
 * Returns array of dates for the last n days
 */
export function getPreviousDays(days: number): Date[] {
  const today = getTodayDate();
  const previousDays: Date[] = [];
  
  for (let i = 1; i <= days; i++) {
    previousDays.push(subDays(today, i));
  }
  
  return previousDays;
}

/**
 * Returns true if the given date is today
 */
export function isToday(date: Date): boolean {
  const today = getTodayDate();
  return date.getTime() === today.getTime();
}

/**
 * Returns number of days between the given date and today
 */
export function daysFromToday(date: Date): number {
  const today = getTodayDate();
  return Math.abs(differenceInDays(date, today));
}
