import { createContext } from 'react';
import type {
  AppSettings,
  ThemeMode,
  UserPreferencesState,
  UserProfile,
} from '../types';

export interface UserPreferencesContextValue extends UserPreferencesState {
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  setTheme: (mode: ThemeMode) => void;
}

export const UserPreferencesContext = createContext<
  UserPreferencesContextValue | undefined
>(undefined);
