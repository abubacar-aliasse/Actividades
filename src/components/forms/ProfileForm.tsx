import { useEffect, useState, type FormEvent } from 'react';
import { useUserPreferences } from '../../hooks/useUserPreferences';

export function ProfileForm() {
  const { profile, updateProfile } = useUserPreferences();
  const [form, setForm] = useState(profile);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
    });
    setStatus('success');
    window.setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="card form">
      <div className="card__body form__body">
        <h2 className="form__title">Configuracoes do perfil</h2>

        <label className="form-field">
          <span className="form-field__label">Nome</span>
          <input
            className="form-field__input"
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="Seu nome"
            autoComplete="name"
          />
        </label>

        <label className="form-field">
          <span className="form-field__label">E-mail</span>
          <input
            className="form-field__input"
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="email@exemplo.com"
            autoComplete="email"
          />
        </label>
      </div>

      <footer className="card__footer form__footer">
        <button type="submit" className="button button--primary">
          Atualizar perfil
        </button>
        {status === 'success' && (
          <span className="form__status" role="status">
            Perfil atualizado!
          </span>
        )}
      </footer>
    </form>
  );
}
