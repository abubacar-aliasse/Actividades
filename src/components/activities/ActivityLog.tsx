import { useCallback, useState } from 'react';
import { useActivities } from '../../hooks/useActivities';
import { ActivityForm, type ActivityFormValues } from './ActivityForm';
import { useCategories } from '../../hooks/useCategories';
import { computeActivityDescription } from '../../utils/activityDescription';
import { getCategoryDefinition } from '../../utils/categoryHelpers';
import { isChargingStatus } from '../../utils/categoryHelpers';

function createEmptyForm(): ActivityFormValues {
  return {
    categoryId: '',
    fields: {},
    status: undefined,
    statusUpdatedAt: undefined,
    nextFollowUp: undefined,
  };
}

export function ActivityLog() {
  const { addActivity } = useActivities();
  const { categories } = useCategories();
  const [formValues, setFormValues] = useState<ActivityFormValues>(() => createEmptyForm());

  const resetForm = () => {
    setFormValues(createEmptyForm());
  };

  const handleSubmit = useCallback(() => {
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

    addActivity({
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
  }, [addActivity, categories, formValues]);

  return (
    <section className="stack">
      <ActivityForm
        values={formValues}
        onChange={setFormValues}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        isEditing={false}
      />
    </section>
  );
}

