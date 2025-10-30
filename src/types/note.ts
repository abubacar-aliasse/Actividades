export type NoteStatus = 'iniciado' | 'em_andamento' | 'cobranca' | 'concluido';

export interface Note {
  id: string;
  date: string;
  name: string;
  status: NoteStatus;
  closeDate?: string;
  description: string;
  alertDate?: string;
  statusUpdatedAt?: string;
  createdAt: string;
}

export type NoteDraft = Omit<Note, 'id' | 'createdAt'>;

