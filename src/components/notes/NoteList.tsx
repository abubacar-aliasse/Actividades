import type { Note } from '../../types';
import { NoteCard } from './NoteCard';
import { EmptyState } from '../shared/EmptyState';

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteList({ notes, onEdit, onDelete }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <EmptyState
        title="Nenhuma nota adicionada"
        description="Crie uma nota para acompanhar lembretes e alertas."
      />
    );
  }

  return (
    <section className="activity-list" aria-live="polite">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </section>
  );
}
