import type { Activity } from '../../types';
import { ActivityCard } from './ActivityCard';
import { EmptyState } from '../shared/EmptyState';

interface ActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

export function ActivityList({
  activities,
  onEdit,
  onDelete,
}: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <EmptyState
        icon="[]"
        title="Nenhuma atividade registrada"
        description="Adicione sua primeira atividade para comecar a acompanhar o dia a dia."
      />
    );
  }

  return (
    <section className="activity-list" aria-live="polite">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
