import { useEffect, useMemo, useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import type { CategoryFieldType } from '../../types';

const FIELD_TYPES: Array<{ value: CategoryFieldType; label: string }> = [
  { value: 'text', label: 'Texto' },
  { value: 'number', label: 'Numero' },
  { value: 'date', label: 'Data' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Telefone' },
  { value: 'textarea', label: 'Texto longo' },
  { value: 'select', label: 'Lista de opcoes' },
];

function normalizeOptionValue(label: string) {
  const trimmed = label.trim();
  const base = trimmed
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/__+/g, '_');

  if (base) {
    return base;
  }

  return `opcao_${Math.random().toString(36).slice(2, 8)}`;
}

function serializeOptions(options?: Array<{ value: string; label: string }>) {
  return options?.map((option) => option.label).join(', ') ?? '';
}

function parseOptions(raw: string) {
  return raw
    .split(/[,;\n]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((label) => ({
      label,
      value: normalizeOptionValue(label) || label.toLowerCase(),
    }));
}

export function CategoryManager() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addField,
    updateField,
    removeField,
  } = useCategories();

  const [newCategory, setNewCategory] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<CategoryFieldType>('text');
  const [newFieldOptions, setNewFieldOptions] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const selected = useMemo(() => {
    if (selectedCategoryId) {
      return categories.find((category) => category.id === selectedCategoryId);
    }
    return categories[0];
  }, [categories, selectedCategoryId]);

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const id = addCategory(newCategory.trim());
    setNewCategory('');
    setSelectedCategoryId(id);
  };

  const handleAddField = () => {
    if (!selected?.id || !newFieldLabel.trim()) return;

    if (newFieldType === 'select' && !newFieldOptions.trim()) {
      window.alert('Informe as opcoes (separe por virgula ou nova linha).');
      return;
    }

    const options =
      newFieldType === 'select' ? parseOptions(newFieldOptions) : undefined;

    addField(selected.id, {
      key: '',
      label: newFieldLabel.trim(),
      type: newFieldType,
      options,
    });
    setNewFieldLabel('');
    setNewFieldType('text');
    setNewFieldOptions('');
  };

  useEffect(() => {
    if (newFieldType !== 'select' && newFieldOptions) {
      setNewFieldOptions('');
    }
  }, [newFieldType, newFieldOptions]);

  const handleFieldTypeChange = (
    categoryId: string,
    fieldId: string,
    type: CategoryFieldType,
  ) => {
    updateField(categoryId, fieldId, {
      type,
      options: type === 'select' ? [] : undefined,
    });
  };

  return (
    <section className="stack">
      <div className="card">
        <div className="card__body">
          <h2 className="form__title">Gerenciar categorias</h2>

          <div className="form-field">
            <span className="form-field__label">Selecionar categoria</span>
            <select
              className="form-field__input"
              value={selected?.id ?? ''}
              onChange={(event) => setSelectedCategoryId(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <div className="form-field">
              <span className="form-field__label">Renomear categoria</span>
              <input
                className="form-field__input"
                value={selected.name}
                onChange={(event) => updateCategory(selected.id, event.target.value)}
              />
            </div>
          )}

          <div className="card__footer" style={{ justifyContent: 'space-between' }}>
            <div className="form-field" style={{ flex: 1 }}>
              <span className="form-field__label">Nova categoria</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  className="form-field__input"
                  placeholder="Nome da categoria"
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                />
                <button
                  className="button button--primary"
                  type="button"
                  onClick={handleAddCategory}
                >
                  Adicionar
                </button>
              </div>
            </div>
            {selected &&
              ![
                'cat_telefonia_movel',
                'cat_atendimento_chamados',
                'cat_atendimento_gerais',
                'cat_atendimento_executivos',
              ].includes(selected.id) && (
                <button
                  className="button button--danger"
                  type="button"
                  onClick={() => deleteCategory(selected.id)}
                >
                  Remover categoria
                </button>
              )}
          </div>
        </div>
      </div>

      {selected && (
        <div className="card">
          <div className="card__body">
            <h3 className="form__title">Campos de "{selected.name}"</h3>

            <div className="form-field">
              <span className="form-field__label">Adicionar campo</span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  newFieldType === 'select'
                    ? '1fr 160px auto'
                    : '1fr 160px auto',
                gap: '0.5rem',
              }}
            >
              <input
                className="form-field__input"
                  placeholder="Label do campo"
                  value={newFieldLabel}
                  onChange={(event) => setNewFieldLabel(event.target.value)}
                />
                <select
                  className="form-field__input"
                  value={newFieldType}
                  onChange={(event) =>
                    setNewFieldType(event.target.value as CategoryFieldType)
                  }
                >
                  {FIELD_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <button
                  className="button button--primary"
                  type="button"
                  onClick={handleAddField}
                >
                  Adicionar campo
                </button>
              </div>
              {newFieldType === 'select' && (
                <div className="form-field" style={{ marginTop: '0.75rem' }}>
                  <span className="form-field__label">
                    Opcoes (separe por virgula ou linha)
                  </span>
                  <textarea
                    className="form-field__input form-field__input--textarea"
                    rows={2}
                    value={newFieldOptions}
                    onChange={(event) => setNewFieldOptions(event.target.value)}
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {selected.fields.map((field) => (
                <div key={field.id} style={{ display: 'grid', gap: '0.5rem' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 160px 80px',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <input
                      className="form-field__input"
                      value={field.label}
                      onChange={(event) =>
                        updateField(selected.id, field.id, {
                          label: event.target.value,
                        })
                      }
                    />
                    <select
                      className="form-field__input"
                      value={field.type}
                      onChange={(event) =>
                        handleFieldTypeChange(
                          selected.id,
                          field.id,
                          event.target.value as CategoryFieldType,
                        )
                      }
                    >
                      {FIELD_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <button
                      className="button button--danger"
                      type="button"
                      onClick={() => removeField(selected.id, field.id)}
                    >
                      Remover
                    </button>
                  </div>
                  {field.type === 'select' && (
                    <textarea
                      className="form-field__input form-field__input--textarea"
                      rows={2}
                      placeholder="Opcao 1, Opcao 2..."
                      value={serializeOptions(field.options)}
                      onChange={(event) =>
                        updateField(selected.id, field.id, {
                          options: parseOptions(event.target.value),
                        })
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
