export interface UserProfile {
  name: string;
  email: string;
}

export type ThemeMode = 'light' | 'dark';

export interface AppSettings {
  language: string;
  theme: ThemeMode;
}

export interface UserPreferencesState {
  profile: UserProfile;
  settings: AppSettings;
}
