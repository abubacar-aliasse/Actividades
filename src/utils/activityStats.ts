import { addDays, format, isSameDay, parseISO, subDays } from 'date-fns';
import type { Activity } from '../types';
import { isChargingStatus } from './categoryHelpers';

const DATE_KEY_FORMAT = 'yyyy-MM-dd';

function getDateKey(date: Date) {
  return format(date, DATE_KEY_FORMAT);
}

function getActivityDateKey(activity: Activity) {
  return getDateKey(parseISO(activity.createdAt));
}

export interface ActivityStats {
  totalActivities: number;
  uniqueCategories: number;
  todayActivities: number;
  currentStreak: number;
  longestStreak: number;
  lastActivity: Activity | null;
  dailyTrend: Array<{ date: string; label: string; count: number }>;
  dueFollowUps: Activity[];
  upcomingFollowUps: Activity[];
}

function getDateKeyFromString(value: string) {
  try {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return format(parsed, DATE_KEY_FORMAT);
    }
  } catch {
    // ignore
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return undefined;
}

export function computeActivityStats(
  activities: Activity[],
  days = 7,
): ActivityStats {
  if (days < 1) {
    throw new Error('days must be a positive number');
  }

  const totalActivities = activities.length;
  const today = new Date();
  const categorySet = new Set(
    activities
      .map((activity) => activity.category?.trim())
      .filter(Boolean) as string[],
  );

  const dateSet = new Set(activities.map(getActivityDateKey));

  let currentStreak = 0;
  let cursor = new Date(today);
  while (dateSet.has(getDateKey(cursor))) {
    currentStreak += 1;
    cursor = subDays(cursor, 1);
  }

  const sortedDateKeys = Array.from(dateSet.values()).sort();
  let longestStreak = 0;
  let streakCounter = 0;
  let previousKey: string | null = null;

  sortedDateKeys.forEach((key) => {
    if (previousKey) {
      const prevDate = parseISO(previousKey);
      const currentDate = parseISO(key);
      const daysDiff = Math.round(
        (currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000),
      );
      streakCounter = daysDiff === 1 ? streakCounter + 1 : 1;
    } else {
      streakCounter = 1;
    }
    longestStreak = Math.max(longestStreak, streakCounter);
    previousKey = key;
  });

  const todayActivities = activities.filter((activity) =>
    isSameDay(parseISO(activity.createdAt), today),
  ).length;

  const todayKey = getDateKey(today);
  const limitDate = addDays(today, 7);
  const limitKey = getDateKey(limitDate);

  const dueFollowUps: Activity[] = [];
  const upcomingFollowUps: Activity[] = [];

  activities.forEach((activity) => {
    if (!isChargingStatus(activity.status) || !activity.nextFollowUp) {
      return;
    }

    const followUpKey = getDateKeyFromString(activity.nextFollowUp);
    if (!followUpKey) {
      return;
    }

    if (followUpKey <= todayKey) {
      dueFollowUps.push(activity);
    } else if (followUpKey <= limitKey) {
      upcomingFollowUps.push(activity);
    }
  });

  const dailyTrend: ActivityStats['dailyTrend'] = [];
  for (let index = days - 1; index >= 0; index -= 1) {
    const targetDate = subDays(today, index);
    const key = getDateKey(targetDate);
    const count = activities.filter(
      (activity) => getActivityDateKey(activity) === key,
    ).length;

    dailyTrend.push({
      date: key,
      label: format(targetDate, 'dd/MM'),
      count,
    });
  }

  return {
    totalActivities,
    uniqueCategories: categorySet.size,
    todayActivities,
    currentStreak,
    longestStreak,
    lastActivity: activities[0] ?? null,
    dailyTrend,
    dueFollowUps,
    upcomingFollowUps,
  };
}
