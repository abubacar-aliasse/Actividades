import { useMemo, useState } from 'react';
import { ActivitiesProvider } from './context/ActivitiesProvider';
import { NotesProvider } from './context/NotesProvider';
import { UserPreferencesProvider } from './context/UserPreferencesProvider';
import { CategoriesProvider } from './context/CategoriesProvider';
import { AppLayout } from './components/layout/AppLayout';
import { Sidebar } from './components/layout/Sidebar';
import { ActivityLog } from './components/activities/ActivityLog';
import { ActivitiesBoard } from './components/activities/ActivitiesBoard';
import { NotesBoard } from './components/notes/NotesBoard';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { ProfileForm } from './components/forms/ProfileForm';
import { SettingsForm } from './components/forms/SettingsForm';
import type { AppView } from './types';
import { useUserPreferences } from './hooks/useUserPreferences';
import './App.css';

const titles: Record<AppView, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Registro Diario de Atividades',
    subtitle: 'Acompanhe indicadores e entradas recentes.',
  },
  log: {
    title: 'Registo de atividades',
    subtitle: 'Adicionar novas atividades.',
  },
  activities: {
    title: 'Actividades',
    subtitle: 'Consultar e gerir todas as actividades registradas.',
  },
  notes: {
    title: 'Notas',
    subtitle: 'Registre observacoes e alertas importantes.',
  },
  profile: {
    title: 'Seu perfil',
    subtitle: 'Mantenha as informacoes sempre atualizadas.',
  },
  settings: {
    title: 'Preferencias',
    subtitle: 'Personalize idioma e tema da aplicacao.',
  },
};

function AppContent() {
  const [view, setView] = useState<AppView>('dashboard');
  const { profile } = useUserPreferences();

  const headerContent = titles[view];
  const userName = profile.name || 'Visitante';

  const mainContent = useMemo(() => {
    switch (view) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'log':
        return <ActivityLog />;
      case 'activities':
        return <ActivitiesBoard />;
      case 'notes':
        return <NotesBoard />;
      case 'profile':
        return <ProfileForm />;
      case 'settings':
        return <SettingsForm />;
      default:
        return null;
    }
  }, [view]);

  const handleViewChange = (value: AppView) => {
    setView(value);
  };

  return (
    <AppLayout
      sidebar={
        <Sidebar
          currentView={view}
          onNavigate={handleViewChange}
          onSignOut={() => window.alert('Sessao finalizada (exemplo).')}
        />
      }
      header={
        <div className="page-header">
          <div>
            <h1>{headerContent.title}</h1>
            <p>{headerContent.subtitle}</p>
          </div>
          <div className="page-header__right">
            <label className="page-header__view">
              <span className="sr-only">Selecionar tela</span>
              <select
                value={view}
                onChange={(event) => handleViewChange(event.target.value as AppView)}
              >
                {Object.entries(titles).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="page-header__user">
              <span className="page-header__user-name">{userName}</span>
              {profile.email && (
                <span className="page-header__user-email">
                  {profile.email}
                </span>
              )}
            </div>
          </div>
        </div>
      }
    >
      {mainContent}
    </AppLayout>
  );
}

export default function App() {
  return (
    <UserPreferencesProvider>
      <CategoriesProvider>
        <ActivitiesProvider>
          <NotesProvider>
            <AppContent />
          </NotesProvider>
        </ActivitiesProvider>
      </CategoriesProvider>
    </UserPreferencesProvider>
  );
}




