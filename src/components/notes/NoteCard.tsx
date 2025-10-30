import type { Note } from '../../types';
import { formatActivityDate, formatDateDisplay } from '../../utils/formatters';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const STATUS_LABELS: Record<Note['status'], string> = {
  iniciado: 'Iniciado',
  em_andamento: 'Em andamento',
  cobranca: 'Cobranca',
  concluido: 'Concluido',
};

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const createdAt = formatActivityDate(note.createdAt);
  const closeDate = formatDateDisplay(note.closeDate);
  const alertDate = formatDateDisplay(note.alertDate);
  const statusUpdatedAt = formatDateDisplay(note.statusUpdatedAt);

  return (
    <article className="card activity-card">
      <div className="card__body activity-card__body">
        <header className="activity-card__meta">
          <time dateTime={note.createdAt}>{createdAt}</time>
          <span className="activity-card__category">
            Nota: <strong>{note.name}</strong>
          </span>
        </header>

        <div className="activity-card__status">
          <span className="activity-status">
            Status: {STATUS_LABELS[note.status] ?? note.status}
          </span>
          {note.date && (
            <span className="activity-status__meta">
              Data: {formatDateDisplay(note.date)}
            </span>
          )}
          {closeDate && (
            <span className="activity-status__meta">
              Fechamento: {closeDate}
            </span>
          )}
          {statusUpdatedAt && (
            <span className="activity-status__meta">
              Atualizado em: {statusUpdatedAt}
            </span>
          )}
          {alertDate && (
            <span className="activity-status__meta">
              Alerta: {alertDate}
            </span>
          )}
        </div>

        {note.description && (
          <p className="activity-card__description">{note.description}</p>
        )}
      </div>

      <footer className="card__footer activity-card__footer">
        <button
          type="button"
          className="button button--outline"
          onClick={() => onEdit(note)}
        >
          Editar
        </button>
        <button
          type="button"
          className="button button--danger"
          onClick={() => onDelete(note.id)}
        >
          Deletar
        </button>
      </footer>
    </article>
  );
}

