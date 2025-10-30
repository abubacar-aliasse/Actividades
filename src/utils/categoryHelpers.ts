import type { CategoryDefinition, CategoryField } from '../types';

export function getCategoryDefinition(
  categories: CategoryDefinition[],
  categoryId?: string,
) {
  if (!categoryId) return undefined;
  return categories.find((category) => category.id === categoryId);
}

export function getFieldDefinitions(category?: CategoryDefinition) {
  return category ? [...category.fields] : [];
}

export function shouldRenderField(
  field: CategoryField,
  values: Record<string, string>,
) {
  if (!field.dependsOn) {
    return true;
  }

  const currentValue = values[field.dependsOn.fieldKey];
  return field.dependsOn.values.includes(currentValue);
}

export function getSelectOptionLabel(
  field: CategoryField,
  value?: string,
): string | undefined {
  if (!value || !field.options) {
    return undefined;
  }

  return field.options.find((option) => option.value === value)?.label;
}

export function isChargingStatus(status?: string) {
  if (!status) {
    return false;
  }
  const normalized = status.toLowerCase();
  return normalized.includes('cobranca') || normalized.includes('andamento');
}

