import type { FormEvent } from 'react';
import type { NoteStatus } from '../../types';
import { todayDateInputValue } from '../../utils/formatters';

export interface NoteFormValues {
  date: string;
  name: string;
  status: NoteStatus;
  closeDate: string;
  description: string;
  alertDate: string;
  statusUpdatedAt: string;
}

interface NoteFormProps {
  values: NoteFormValues;
  onChange: (values: NoteFormValues) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

const STATUS_OPTIONS: Array<{ value: NoteStatus; label: string }> = [
  { value: 'iniciado', label: 'Iniciado' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'cobranca', label: 'Cobranca' },
  { value: 'concluido', label: 'Concluido' },
];

export function NoteForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  isEditing = false,
  isSubmitting = false,
}: NoteFormProps) {
  const handleFieldChange = (
    field: keyof NoteFormValues,
    value: string,
  ) => {
    onChange({ ...values, [field]: value });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="card__body form__body">
        <div className="form-field">
          <span className="form-field__label">Data</span>
          <input
            className="form-field__input"
            type="date"
            value={values.date}
            onChange={(event) => handleFieldChange('date', event.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <span className="form-field__label">Nome</span>
          <input
            className="form-field__input"
            value={values.name}
            onChange={(event) => handleFieldChange('name', event.target.value)}
            placeholder="Titulo ou responsavel"
            required
          />
        </div>

        <div className="form-field">
          <span className="form-field__label">Status</span>
          <select
            className="form-field__input"
            value={values.status}
            onChange={(event) =>
              onChange({
                ...values,
                status: event.target.value as NoteStatus,
                statusUpdatedAt: todayDateInputValue(),
              })
            }
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <span className="form-field__label">Atualizado em</span>
          <input
            className="form-field__input"
            type="date"
            value={values.statusUpdatedAt}
            readOnly
            disabled
          />
        </div>

        <div className="form-field">
          <span className="form-field__label">Data de fechamento</span>
          <input
            className="form-field__input"
            type="date"
            value={values.closeDate}
            onChange={(event) => handleFieldChange('closeDate', event.target.value)}
            min={values.date || undefined}
          />
        </div>

        <div className="form-field">
          <span className="form-field__label">Descricao</span>
          <textarea
            className="form-field__input form-field__input--textarea"
            rows={3}
            value={values.description}
            onChange={(event) => handleFieldChange('description', event.target.value)}
            placeholder="Detalhes da nota"
          />
        </div>

        <div className="form-field">
          <span className="form-field__label">Alerta</span>
          <input
            className="form-field__input"
            type="date"
            value={values.alertDate}
            onChange={(event) => handleFieldChange('alertDate', event.target.value)}
          />
        </div>
      </div>

      <footer className="card__footer activity-form__footer">
        {isEditing && onCancel && (
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



