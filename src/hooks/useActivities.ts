import { useContext } from 'react';
import { ActivitiesContext } from '../context/ActivitiesContext';

export function useActivities() {
  const context = useContext(ActivitiesContext);

  if (!context) {
    throw new Error(
      'useActivities must be used within an ActivitiesProvider instance',
    );
  }

  return context;
}
