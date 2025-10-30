import { useCallback, useMemo, type ReactNode } from 'react';
import type { Note, NoteDraft } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { NotesContext } from './NotesContext';

const STORAGE_KEY = 'registro-atividades@notes';

function createId(prefix = 'note') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEY, []);

  const addNote = useCallback(
    (draft: NoteDraft) => {
      const now = new Date().toISOString();
      const note: Note = {
        id: createId(),
        ...draft,
        statusUpdatedAt: draft.statusUpdatedAt ?? now,
        createdAt: now,
      };
      setNotes((prev) => [note, ...prev]);
      return note;
    },
    [setNotes],
  );

  const updateNote = useCallback(
    (id: string, draft: NoteDraft) => {
      setNotes((prev) =>
        prev.map((note) => {
          if (note.id !== id) {
            return note;
          }

          const statusChanged = draft.status && draft.status !== note.status;

          return {
            ...note,
            ...draft,
            statusUpdatedAt: statusChanged
              ? new Date().toISOString()
              : draft.statusUpdatedAt ?? note.statusUpdatedAt,
          };
        }),
      );
    },
    [setNotes],
  );

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((note) => note.id !== id));
    },
    [setNotes],
  );

  const value = useMemo(
    () => ({
      notes,
      addNote,
      updateNote,
      deleteNote,
    }),
    [notes, addNote, updateNote, deleteNote],
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}
