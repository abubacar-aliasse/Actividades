import { useCallback, useEffect, useMemo, type ReactNode } from 'react';
import type {
  AppSettings,
  ThemeMode,
  UserPreferencesState,
  UserProfile,
} from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { UserPreferencesContext } from './UserPreferencesContext';

const DEFAULT_STATE: UserPreferencesState = {
  profile: {
    name: '',
    email: '',
  },
  settings: {
    language: 'pt-BR',
    theme: 'light',
  },
};

const STORAGE_KEY = 'registro-atividades@preferences';

export function UserPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useLocalStorage<UserPreferencesState>(
    STORAGE_KEY,
    DEFAULT_STATE,
  );

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      setState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...updates,
        },
      }));
    },
    [setState],
  );

  const updateSettings = useCallback(
    (updates: Partial<AppSettings>) => {
      setState((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          ...updates,
        },
      }));
    },
    [setState],
  );

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      updateSettings({ theme: mode });
    },
    [updateSettings],
  );

  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme;
  }, [state.settings.theme]);

  const value = useMemo(
    () => ({
      ...state,
      updateProfile,
      updateSettings,
      setTheme,
    }),
    [state, updateProfile, updateSettings, setTheme],
  );

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
}
