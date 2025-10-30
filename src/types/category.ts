export type CategoryFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'email'
  | 'tel'
  | 'select'
  | 'textarea';

export interface CategoryField {
  id: string; // stable id
  key: string; // storage key (e.g., "numero_linha")
  label: string; // display label (e.g., "Numero / Linha")
  type: CategoryFieldType;
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  dependsOn?: { fieldKey: string; values: string[] };
}

export interface CategoryDefinition {
  id: string;
  name: string;
  fields: CategoryField[];
}
