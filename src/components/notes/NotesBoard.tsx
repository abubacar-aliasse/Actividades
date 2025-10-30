import { useCallback, useMemo, useState } from 'react';
import type { Note, NoteDraft, NoteStatus } from '../../types';
import { useNotes } from '../../hooks/useNotes';
import { NoteForm, type NoteFormValues } from './NoteForm';
import { NoteList } from './NoteList';
import { todayDateInputValue } from '../../utils/formatters';

const STATUS_FILTER_LABELS: Record<NoteStatus | 'todos', string> = {
  todos: 'Todos',
  iniciado: 'Iniciado',
  em_andamento: 'Em andamento',
  cobranca: 'Cobranca',
  concluido: 'Concluido',
};

function createEmptyNote(): NoteFormValues {
  const today = todayDateInputValue();
  return {
    date: today,
    name: '',
    status: 'iniciado',
    closeDate: '',
    description: '',
    alertDate: '',
    statusUpdatedAt: today,
  };
}

export function NotesBoard() {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [formValues, setFormValues] = useState<NoteFormValues>(() => createEmptyNote());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<NoteStatus | 'todos'>(
    'todos',
  );
  const [search, setSearch] = useState('');

  const filteredNotes = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return notes.filter((note) => {
      const matchStatus =
        statusFilter === 'todos' || note.status === statusFilter;
      const matchSearch =
        !normalized ||
        note.name.toLowerCase().includes(normalized) ||
        note.description.toLowerCase().includes(normalized);
      return matchStatus && matchSearch;
    });
  }, [notes, statusFilter, search]);

  const resetForm = () => {
    setFormValues(createEmptyNote());
    setEditingId(null);
  };

  const handleSubmit = useCallback(() => {
    if (!formValues.name.trim()) {
      window.alert('Informe o nome da nota.');
      return;
    }

    if (!formValues.description.trim()) {
      window.alert('Informe a descricao da nota.');
      return;
    }

    const draft: NoteDraft = {
      date: formValues.date,
      name: formValues.name.trim(),
      status: formValues.status,
      closeDate: formValues.closeDate || undefined,
      description: formValues.description.trim(),
      alertDate: formValues.alertDate || undefined,
      statusUpdatedAt: formValues.statusUpdatedAt || todayDateInputValue(),
    };

    if (editingId) {
      updateNote(editingId, draft);
    } else {
      addNote(draft);
    }

    resetForm();
  }, [addNote, editingId, formValues, updateNote]);

  const handleEdit = useCallback((note: Note) => {
    setFormValues({
      date: note.date,
      name: note.name,
      status: note.status,
      closeDate: note.closeDate ?? '',
      description: note.description,
      alertDate: note.alertDate ?? '',
      statusUpdatedAt: note.statusUpdatedAt ?? todayDateInputValue(),
    });
    setEditingId(note.id);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      const confirmed = window.confirm('Deseja remover esta nota?');
      if (confirmed) {
        deleteNote(id);
      }
    },
    [deleteNote],
  );

  return (
    <section className="stack">
      <NoteForm
        values={formValues}
        onChange={setFormValues}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        isEditing={Boolean(editingId)}
      />

      <div className="card">
        <div className="card__body filter">
          <div className="form-field">
            <span className="form-field__label">Status</span>
            <select
              className="form-field__input"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as NoteStatus | 'todos')
              }
            >
              {Object.entries(STATUS_FILTER_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <label className="form-field" style={{ flex: 1 }}>
            <span className="form-field__label">Buscar</span>
            <input
              className="form-field__input"
              type="search"
              placeholder="Nome ou descricao"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>
      </div>

      <NoteList notes={filteredNotes} onEdit={handleEdit} onDelete={handleDelete} />
    </section>
  );
}


