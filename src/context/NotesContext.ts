import { createContext } from 'react';
import type { Note, NoteDraft } from '../types';

export interface NotesContextValue {
  notes: Note[];
  addNote: (draft: NoteDraft) => Note;
  updateNote: (id: string, draft: NoteDraft) => void;
  deleteNote: (id: string) => void;
}

export const NotesContext = createContext<NotesContextValue | undefined>(
  undefined,
);
