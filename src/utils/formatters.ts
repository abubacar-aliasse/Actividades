import { format } from 'date-fns';

export function formatActivityDate(isoDate: string) {
  try {
    return format(new Date(isoDate), "dd/MM/yyyy 'as' HH:mm");
  } catch (error) {
    console.warn('Failed to format date', isoDate, error);
    return isoDate;
  }
}

export function normalizeCategoryLabel(category?: string) {
  return category?.trim().toLowerCase() || 'sem categoria';
}

export function displayCategoryLabel(category?: string) {
  return category?.trim() || 'Sem categoria';
}

export function toDateInputValue(date?: string | Date) {
  if (!date) {
    return '';
  }

  const parsed = typeof date === 'string' ? new Date(date) : date;

  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return format(parsed, 'yyyy-MM-dd');
}

export function todayDateInputValue() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDateDisplay(value?: string) {
  if (!value) {
    return '';
  }

  try {
    return format(new Date(value), 'dd/MM/yyyy');
  } catch (error) {
    console.warn('Failed to format date for display', value, error);
    return value;
  }
}
