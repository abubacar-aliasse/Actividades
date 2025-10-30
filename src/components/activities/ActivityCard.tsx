import type { Activity } from '../../types';
import { formatActivityDate, formatDateDisplay } from '../../utils/formatters';
import { useCategories } from '../../hooks/useCategories';
import {
  getCategoryDefinition,
  getFieldDefinitions,
  getSelectOptionLabel,
  isChargingStatus,
} from '../../utils/categoryHelpers';

interface ActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

export function ActivityCard({ activity, onEdit, onDelete }: ActivityCardProps) {
  const formattedDate = formatActivityDate(activity.createdAt);
  const { categories } = useCategories();

  const category = getCategoryDefinition(categories, activity.categoryId);
  const fieldDefinitions = getFieldDefinitions(category);
  const fields = activity.fields ?? {};

  const statusField = fieldDefinitions.find((field) => field.key === 'status');
  const statusLabel =
    statusField && activity.status
      ? getSelectOptionLabel(statusField, activity.status) ?? activity.status
      : activity.status;

  const statusUpdatedAt =
    activity.statusUpdatedAt ?? fields.status_modificado ?? '';
  const nextFollowUp = activity.nextFollowUp ?? fields.proxima_cobranca ?? '';
  const charging = isChargingStatus(activity.status);

  const detailsFields = fieldDefinitions.filter(
    (field) =>
      field.key !== 'status' &&
      field.key !== 'status_modificado' &&
      field.key !== 'proxima_cobranca',
  );

  return (
    <article className="card activity-card">
      <div className="card__body activity-card__body">
        <header className="activity-card__meta">
          <time dateTime={activity.createdAt}>{formattedDate}</time>
          <span className="activity-card__category">
            Categoria:{' '}
            <strong>{category?.name ?? activity.category ?? 'N/A'}</strong>
          </span>
        </header>

        <p className="activity-card__description">{activity.description}</p>

        {(statusLabel || statusUpdatedAt || nextFollowUp) && (
          <div className="activity-card__status">
            {statusLabel && (
              <span
                className={`activity-status ${
                  charging ? 'activity-status--alert' : ''
                }`}
              >
                Status: {statusLabel}
              </span>
            )}
            {statusUpdatedAt && (
              <span className="activity-status__meta">
                Atualizado em: {formatDateDisplay(statusUpdatedAt)}
              </span>
            )}
            {nextFollowUp && charging && (
              <span className="activity-status__meta">
                Proxima cobranca: {formatDateDisplay(nextFollowUp)}
              </span>
            )}
          </div>
        )}

        {detailsFields.length > 0 && (
          <dl className="dashboard__recent-meta">
            {detailsFields.map((field) => {
              const rawValue = fields[field.key];
              if (!rawValue) {
                return null;
              }

              let displayValue = rawValue;
              if (field.type === 'date') {
                displayValue = formatDateDisplay(rawValue) || rawValue;
              } else if (field.type === 'select') {
                displayValue =
                  getSelectOptionLabel(field, rawValue) ?? rawValue;
              }

              return (
                <div key={field.id}>
                  <dt>{field.label}</dt>
                  <dd>{displayValue}</dd>
                </div>
              );
            })}
          </dl>
        )}
      </div>

      <footer className="card__footer activity-card__footer">
        <button
          type="button"
          className="button button--outline"
          onClick={() => onEdit(activity)}
        >
          Editar
        </button>
        <button
          type="button"
          className="button button--danger"
          onClick={() => onDelete(activity.id)}
        >
          Deletar
        </button>
      </footer>
    </article>
  );
}
