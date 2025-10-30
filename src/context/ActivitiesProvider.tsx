import { useCallback, useMemo, type ReactNode } from 'react';
import type { Activity, ActivityDraft } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ActivitiesContext } from './ActivitiesContext';

const STORAGE_KEY = 'registro-atividades@activities';

export function ActivitiesProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useLocalStorage<Activity[]>(STORAGE_KEY, []);

  const addActivity = useCallback(
    (draft: ActivityDraft) => {
      const nowIso = new Date().toISOString();
      const activity: Activity = {
        id: crypto.randomUUID(),
        description: draft.description.trim(),
        category: draft.category?.trim() || undefined,
        categoryId: draft.categoryId,
        status: draft.status,
        statusUpdatedAt:
          draft.status ? draft.statusUpdatedAt ?? nowIso : undefined,
        nextFollowUp: draft.nextFollowUp,
        fields: draft.fields ?? undefined,
        createdAt: nowIso,
      };

      setActivities((prev) => [activity, ...prev]);

      return activity;
    },
    [setActivities],
  );

  const updateActivity = useCallback(
    (id: string, draft: ActivityDraft) => {
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === id
            ? {
                ...activity,
                description: draft.description.trim(),
                category: draft.category?.trim() || undefined,
                categoryId: draft.categoryId ?? activity.categoryId,
                status: draft.status ?? activity.status,
                statusUpdatedAt:
                  draft.statusUpdatedAt ??
                  (draft.status && draft.status !== activity.status
                    ? new Date().toISOString()
                    : activity.statusUpdatedAt),
                nextFollowUp:
                  draft.nextFollowUp !== undefined
                    ? draft.nextFollowUp
                    : activity.nextFollowUp,
                fields: draft.fields ?? activity.fields,
              }
            : activity,
        ),
      );
    },
    [setActivities],
  );

  const deleteActivity = useCallback(
    (id: string) => {
      setActivities((prev) => prev.filter((activity) => activity.id !== id));
    },
    [setActivities],
  );

  const value = useMemo(
    () => ({
      activities,
      addActivity,
      updateActivity,
      deleteActivity,
    }),
    [activities, addActivity, updateActivity, deleteActivity],
  );

  return (
    <ActivitiesContext.Provider value={value}>
      {children}
    </ActivitiesContext.Provider>
  );
}
