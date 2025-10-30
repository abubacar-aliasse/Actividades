import { createContext } from 'react';
import type { Activity, ActivityDraft } from '../types';

export interface ActivitiesContextValue {
  activities: Activity[];
  addActivity: (draft: ActivityDraft) => Activity;
  updateActivity: (id: string, draft: ActivityDraft) => void;
  deleteActivity: (id: string) => void;
}

export const ActivitiesContext = createContext<ActivitiesContextValue | undefined>(
  undefined,
);
