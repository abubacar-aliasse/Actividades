import { addDays, format, isSameDay, parseISO } from 'date-fns';
import type { Note } from '../types';

const INPUT_FORMAT = 'yyyy-MM-dd';

function toInputKey(value: string | undefined) {
  if (!value) return undefined;
  try {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return format(date, INPUT_FORMAT);
    }
  } catch {
    return undefined;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  return undefined;
}

export interface NoteStats {
  total: number;
  statusCount: Record<string, number>;
  dueAlerts: Note[];
  upcomingAlerts: Note[];
  todayCreated: number;
}

const ALERT_STATUSES = new Set(['em_andamento', 'cobranca']);

export function computeNoteStats(notes: Note[]): NoteStats {
  const today = new Date();
  const todayKey = format(today, INPUT_FORMAT);
  const limitKey = format(addDays(today, 7), INPUT_FORMAT);

  const statusCount: Record<string, number> = {};
  const dueAlerts: Note[] = [];
  const upcomingAlerts: Note[] = [];

  let todayCreated = 0;

  notes.forEach((note) => {
    statusCount[note.status] = (statusCount[note.status] || 0) + 1;

    if (isSameDay(parseISO(note.createdAt), today)) {
      todayCreated += 1;
    }

    if (!ALERT_STATUSES.has(note.status)) {
      return;
    }

    const alertKey = toInputKey(note.alertDate);
    if (!alertKey) {
      return;
    }

    if (alertKey <= todayKey) {
      dueAlerts.push(note);
    } else if (alertKey <= limitKey) {
      upcomingAlerts.push(note);
    }
  });

  return {
    total: notes.length,
    statusCount,
    dueAlerts,
    upcomingAlerts,
    todayCreated,
  };
}

