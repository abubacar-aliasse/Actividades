import { useCallback, useMemo, useState } from 'react';
import type { Activity } from '../../types';
import { useActivities } from '../../hooks/useActivities';
import { useCategories } from '../../hooks/useCategories';
import { ActivityForm, type ActivityFormValues } from './ActivityForm';
import { ActivityList } from './ActivityList';
import {
  getCategoryDefinition,
  getFieldDefinitions,
  getSelectOptionLabel,
  isChargingStatus,
} from '../../utils/categoryHelpers';
import { computeActivityDescription } from '../../utils/activityDescription';
import { todayDateInputValue } from '../../utils/formatters';

export function ActivitiesBoard() {
  const { activities, updateActivity, deleteActivity } = useActivities();
  const { categories } = useCategories();
  const [filter, setFilter] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<ActivityFormValues | null>(null);

  const filteredActivities = useMemo(() => {
    const normalized = filter.trim().toLowerCase();

    if (!normalized) {
      return activities;
    }

    return activities.filter((activity) => {
      const category = getCategoryDefinition(categories, activity.categoryId);
      const fields = activity.fields ?? {};
      const fieldValues = Object.values(fields).join(' ').toLowerCase();

      const statusField = getFieldDefinitions(category).find(
        (field) => field.key === 'status',
      );
      const statusLabel =
        statusField && activity.status
          ? getSelectOptionLabel(statusField, activity.status)
          : '';

      return (
        (activity.category ?? '').toLowerCase().includes(normalized) ||
        (category?.name ?? '').toLowerCase().includes(normalized) ||
        (activity.description ?? '').toLowerCase().includes(normalized) ||
        (activity.status ?? '').toLowerCase().includes(normalized) ||
        (statusLabel ?? '').toLowerCase().includes(normalized) ||
        (activity.nextFollowUp ?? '').toLowerCase().includes(normalized) ||
        fieldValues.includes(normalized)
      );
    });
  }, [activities, categories, filter]);

  const resetForm = useCallback(() => {
    setFormValues(null);
    setEditingId(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!editingId || !formValues) {
      return;
    }

    if (!formValues.categoryId) {
      window.alert('Selecione a categoria da atividade.');
      return;
    }

    if (isChargingStatus(formValues.status) && !formValues.nextFollowUp) {
      window.alert('Defina a data da proxima cobranca.');
      return;
    }

    const category = getCategoryDefinition(categories, formValues.categoryId);
    const categoryName = category?.name;
    const description = computeActivityDescription(formValues.fields, categoryName);

    updateActivity(editingId, {
      description,
      category: categoryName,
      categoryId: formValues.categoryId,
      status: formValues.status,
      statusUpdatedAt: formValues.statusUpdatedAt,
      nextFollowUp: formValues.nextFollowUp,
      fields:
        Object.keys(formValues.fields).length > 0
          ? formValues.fields
          : undefined,
    });

    resetForm();
  }, [categories, editingId, formValues, updateActivity, resetForm]);

  const handleEdit = useCallback((activity: Activity) => {
    setEditingId(activity.id);
    setFormValues({
      categoryId: activity.categoryId ?? '',
      fields: { ...(activity.fields ?? {}) },
      status: activity.status,
      statusUpdatedAt: activity.statusUpdatedAt ?? todayDateInputValue(),
      nextFollowUp: activity.nextFollowUp ?? '',
    });
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      const confirmed = window.confirm('Tem certeza que deseja deletar?');
      if (confirmed) {
        deleteActivity(id);
      }
    },
    [deleteActivity],
  );

  return (
    <section className="stack">
      {formValues && editingId && (
        <ActivityForm
          values={formValues}
          onChange={setFormValues}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing
        />
      )}

      <div className="card">
        <div className="card__body filter">
          <label className="form-field">
            <span className="form-field__label">Filtro rapido</span>
            <input
              className="form-field__input"
              type="search"
              placeholder="Buscar por categoria, status ou descricao"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filtrar atividades"
            />
          </label>
          <span className="filter__results" role="status">
            {filteredActivities.length} resultado
            {filteredActivities.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <ActivityList
        activities={filteredActivities}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </section>
  );
}
