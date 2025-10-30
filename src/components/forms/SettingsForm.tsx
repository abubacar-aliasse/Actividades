import { useEffect, useState, type FormEvent } from 'react';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import type { ThemeMode } from '../../types';
import { CategoryManager } from './CategoryManager';

export function SettingsForm() {
  const { settings, updateSettings, setTheme } = useUserPreferences();
  const [language, setLanguage] = useState(settings.language);
  const [theme, setLocalTheme] = useState<ThemeMode>(settings.theme);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  useEffect(() => {
    setLanguage(settings.language);
    setLocalTheme(settings.theme);
  }, [settings]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSettings({ language });
    setTheme(theme);
    setStatus('success');
    window.setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <section className="stack">
      <form onSubmit={handleSubmit} className="card form">
        <div className="card__body form__body">
          <h2 className="form__title">Preferencias da aplicacao</h2>

          <label className="form-field">
            <span className="form-field__label">Idioma preferido</span>
            <input
              className="form-field__input"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              placeholder="Ex: pt-BR"
            />
          </label>

          <fieldset className="form-field">
            <legend className="form-field__label">Tema</legend>
            <div className="form-field__choice-group">
              <label className="form-field__choice">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={() => setLocalTheme('light')}
                />
                Claro
              </label>
              <label className="form-field__choice">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={() => setLocalTheme('dark')}
                />
                Escuro
              </label>
            </div>
          </fieldset>
        </div>

        <footer className="card__footer form__footer">
          <button type="submit" className="button button--primary">
            Salvar preferencias
          </button>
          {status === 'success' && (
            <span className="form__status" role="status">
              Configuracoes salvas!
            </span>
          )}
        </footer>
      </form>

      <CategoryManager />
    </section>
  );
}

