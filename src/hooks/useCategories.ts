import { useContext } from 'react';
import { CategoriesContext } from '../context/CategoriesContext';

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error('useCategories must be used within CategoriesProvider');
  }
  return ctx;
}

