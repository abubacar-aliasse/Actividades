import { useEffect, useMemo, type ChangeEvent, type FormEvent } from 'react';
import { useCategories } from '../../hooks/useCategories';
import type {
  CategoryDefinition,
  CategoryField,
  CategoryFieldType,
} from '../../types';
import {
  getCategoryDefinition,
  getFieldDefinitions,
  shouldRenderField,
  isChargingStatus,
  getSelectOptionLabel,
} from '../../utils/categoryHelpers';
import { todayDateInputValue } from '../../utils/formatters';

function resolveInputType(
  type: CategoryFieldType,
): 'text' | 'number' | 'date' | 'email' | 'tel' {
  if (type === 'textarea' || type === 'select') {
    return 'text';
  }
  return type;
}

export interface ActivityFormValues {
  categoryId: string;
  fields: Record<string, string>;
  status?: string;
  statusUpdatedAt?: string;
  nextFollowUp?: string;
}

interface ActivityFormProps {
  values: ActivityFormValues;
  onChange: (next: ActivityFormValues) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

function fieldsAreEqual(
  a: Record<string, string>,
  b: Record<string, string>,
) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  return aKeys.every((key) => a[key] === b[key]);
}

function valuesAreEqual(a: ActivityFormValues, b: ActivityFormValues) {
  return (
    a.categoryId === b.categoryId &&
    a.status === b.status &&
    a.statusUpdatedAt === b.statusUpdatedAt &&
    a.nextFollowUp === b.nextFollowUp &&
    fieldsAreEqual(a.fields, b.fields)
  );
}

function synchronizeValues(
  current: ActivityFormValues,
  category: CategoryDefinition | undefined,
  fieldDefinitions: CategoryField[],
) {
  if (!category) {
    return {
      ...current,
      categoryId: '',
      fields: {},
      status: undefined,
      statusUpdatedAt: undefined,
      nextFollowUp: undefined,
    };
  }

  const nextFields: Record<string, string> = {};
  const today = todayDateInputValue();

  fieldDefinitions.forEach((field) => {
    let value = current.fields[field.key];

    if (field.key === 'status') {
      value =
        value ??
        current.status ??
        field.options?.[0]?.value ??
        '';
    }

    if (field.key === 'status_modificado') {
      value = current.statusUpdatedAt ?? value ?? today;
    }

    if (field.key === 'proxima_cobranca') {
      value = current.nextFollowUp ?? value ?? '';
    }

    if (field.key === 'data_criacao') {
      value = value ?? today;
    }

    if (field.readOnly && !value) {
      value = field.type === 'date' ? today : '';
    }

    if (value === undefined) {
      value = '';
    }

    nextFields[field.key] = value;
  });

  const status = nextFields.status || undefined;
  let statusUpdatedAt = current.statusUpdatedAt;

  if (status) {
    if (!statusUpdatedAt || current.status !== status) {
      statusUpdatedAt = today;
    }
    nextFields.status_modificado = statusUpdatedAt;
  } else {
    statusUpdatedAt = undefined;
    if (nextFields.status_modificado) {
      nextFields.status_modificado = '';
    }
  }

  let nextFollowUp = nextFields.proxima_cobranca || undefined;
  if (status && isChargingStatus(status)) {
    if (!nextFollowUp) {
      nextFollowUp = today;
      nextFields.proxima_cobranca = today;
    }
  } else {
    nextFollowUp = undefined;
    if (nextFields.proxima_cobranca) {
      nextFields.proxima_cobranca = '';
    }
  }

  return {
    ...current,
    categoryId: category.id,
    fields: nextFields,
    status,
    statusUpdatedAt,
    nextFollowUp,
  };
}

export function ActivityForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  isEditing = false,
  isSubmitting = false,
}: ActivityFormProps) {
  const { categories } = useCategories();

  const selectedCategory = useMemo(
    () => getCategoryDefinition(categories, values.categoryId),
    [categories, values.categoryId],
  );

  const fieldDefinitions = useMemo(
    () => getFieldDefinitions(selectedCategory),
    [selectedCategory],
  );

  const orderedFields = useMemo(() => {
    if (fieldDefinitions.length === 0) {
      return [] as CategoryField[];
    }
    const statusFields = fieldDefinitions.filter((field) => field.key === 'status');
    const others = fieldDefinitions.filter((field) => field.key !== 'status');
    return [...statusFields, ...others];
  }, [fieldDefinitions]);

  const fieldMap = useMemo(() => {
    const map = new Map<string, CategoryField>();
    orderedFields.forEach((field) => {
      map.set(field.key, field);
    });
    return map;
  }, [orderedFields]);

  useEffect(() => {
    const synced = synchronizeValues(values, selectedCategory, orderedFields);

    if (!valuesAreEqual(synced, values)) {
      onChange(synced);
    }
  }, [orderedFields, onChange, selectedCategory, values]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = getCategoryDefinition(categories, categoryId);

    const base: ActivityFormValues = {
      ...values,
      categoryId,
      fields: {},
      status: undefined,
      statusUpdatedAt: undefined,
      nextFollowUp: undefined,
    };

    const synced = synchronizeValues(
      base,
      category,
      getFieldDefinitions(category),
    );

    onChange(synced);
  };

  const handleFieldChange = (key: string, rawValue: string) => {
    const field = fieldMap.get(key);
    if (!field || field.readOnly) {
      return;
    }

    const value = field.type === 'number' ? rawValue.replace(/[^\d-]/g, '') : rawValue;

    const nextFields = { ...values.fields, [key]: value };
    let status = values.status;
    let statusUpdatedAt = values.statusUpdatedAt;
    let nextFollowUp = values.nextFollowUp;

    if (key === 'status') {
      status = value || undefined;
      if (status) {
        statusUpdatedAt = todayDateInputValue();
        nextFields.status_modificado = statusUpdatedAt;
        if (isChargingStatus(status)) {
          const followUp = nextFollowUp ?? todayDateInputValue();
          nextFields.proxima_cobranca = followUp;
          nextFollowUp = followUp;
        } else if (nextFields.proxima_cobranca) {
          nextFields.proxima_cobranca = '';
          nextFollowUp = undefined;
        }
      } else {
        statusUpdatedAt = undefined;
        if (nextFields.status_modificado) {
          nextFields.status_modificado = '';
        }
        if (nextFields.proxima_cobranca) {
          nextFields.proxima_cobranca = '';
        }
        nextFollowUp = undefined;
      }
    }

    if (key === 'proxima_cobranca') {
      nextFollowUp = value || undefined;
    }

    const next: ActivityFormValues = {
      ...values,
      fields: nextFields,
      status,
      statusUpdatedAt,
      nextFollowUp,
    };

    onChange(next);
  };

  const renderField = (field: CategoryField) => {
    if (!shouldRenderField(field, values.fields)) {
      return null;
    }

    let value = values.fields[field.key] ?? '';
    if (field.key === 'status' && value && field.options) {
      value = field.options.find((option) => option.value === value)?.value ?? value;
    }

    const isRequired =
      field.required ||
      (field.key === 'proxima_cobranca' && isChargingStatus(values.status));

    const commonProps = {
      className: 'form-field__input',
      value,
      readOnly: field.readOnly,
      disabled: field.readOnly,
      required: isRequired,
      placeholder: field.placeholder,
      onChange: (
        event: ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => handleFieldChange(field.key, event.target.value),
    };

    return (
      <label key={field.id} className="form-field">
        <span className="form-field__label">
          {field.label}
          {isRequired ? ' *' : ''}
        </span>
        {field.type === 'textarea' ? (
          <textarea
            {...commonProps}
            className="form-field__input form-field__input--textarea"
            rows={3}
          />
        ) : field.type === 'select' ? (
          <select {...commonProps}>
            <option value="">Selecione...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...commonProps}
            type={resolveInputType(field.type)}
          />
        )}
      </label>
    );
  };

  const statusField = orderedFields.find((field) => field.key === 'status');
  const statusLabel =
    statusField && values.status
      ? getSelectOptionLabel(statusField, values.status) ?? values.status
      : undefined;

  return (
    <form className="card activity-form" onSubmit={handleSubmit}>
      <div className="card__body activity-form__body">
        <label className="form-field">
          <span className="form-field__label">Categoria</span>
          <select
            className="form-field__input"
            value={values.categoryId}
            onChange={(event) => handleCategoryChange(event.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        {orderedFields.length > 0 && (
          <div className="card">
            <div className="card__body">
              {orderedFields.map(renderField)}
            </div>
          </div>
        )}

        {statusLabel && (
          <p className="form__status" role="status">
            Status selecionado: {statusLabel}
          </p>
        )}
      </div>

      <footer className="card__footer activity-form__footer">
        {isEditing && (
          <button
            type="button"
            className="button button--ghost"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="button button--primary"
          disabled={isSubmitting}
        >
          {isEditing ? 'Atualizar' : 'Salvar'}
        </button>
      </footer>
    </form>
  );
}
