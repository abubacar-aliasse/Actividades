export interface Activity {
  id: string;
  description: string;
  // Human-readable category name (kept for backward compatibility and quick display)
  category?: string;
  // Structured link to a predefined category
  categoryId?: string;
  status?: string;
  statusUpdatedAt?: string;
  nextFollowUp?: string;
  // Structured, per-category field values (key -> value)
  fields?: Record<string, string>;
  createdAt: string;
}

export type ActivityDraft = Omit<Activity, 'id' | 'createdAt'>;

export type CategorySummary = Record<string, number>;
