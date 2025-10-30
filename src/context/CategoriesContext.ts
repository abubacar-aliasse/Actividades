import { createContext } from 'react';
import type { CategoryDefinition, CategoryField } from '../types';

export interface CategoriesContextValue {
  categories: CategoryDefinition[];
  addCategory: (name: string) => string; // returns new id
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  addField: (categoryId: string, field: Omit<CategoryField, 'id'>) => string; // returns field id
  updateField: (
    categoryId: string,
    fieldId: string,
    updates: Partial<Omit<CategoryField, 'id'>>,
  ) => void;
  removeField: (categoryId: string, fieldId: string) => void;
}

export const CategoriesContext = createContext<CategoriesContextValue | undefined>(
  undefined,
);

