import type { ReactNode } from 'react';
import type { AppView } from '../../types';

const ICON_SIZE = 18;

const ICONS: Record<AppView | 'logout', ReactNode> = {
  dashboard: (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 13h6v8H3z" />
      <path d="M15 3h6v18h-6z" />
      <path d="M9 3h6v5H9z" />
    </svg>
  ),
  log: (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 4h14v4H5z" />
      <path d="M9 8v12" />
      <path d="M5 12h8" />
    </svg>
  ),
  activities: (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h10" />
      <path d="M7 12h6" />
      <path d="M7 16h4" />
    </svg>
  ),
  notes: (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 3h16v18H4z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </svg>
  ),
  profile: (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
  settings: (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 15.5A3.5 3.5 0 1 0 8.5 12a3.5 3.5 0 0 0 3.5 3.5z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  logout: (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  ),
};

interface NavigationItem {
  view: AppView;
  label: string;
  icon: ReactNode;
}

const NAVIGATION: NavigationItem[] = [
  { view: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard },
  { view: 'log', label: 'Registo', icon: ICONS.log },
  { view: 'activities', label: 'Actividades', icon: ICONS.activities },
  { view: 'notes', label: 'Notas', icon: ICONS.notes },
  { view: 'profile', label: 'Meu Perfil', icon: ICONS.profile },
  { view: 'settings', label: 'Preferencias', icon: ICONS.settings },
];

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onSignOut?: () => void;
}

export function Sidebar({ currentView, onNavigate, onSignOut }: SidebarProps) {
  return (
    <nav className="sidebar" aria-label="Navegacao principal">
      <h1 className="sidebar__logo" aria-label="Registro de atividades">
        Menu
      </h1>

      <ul className="sidebar__list">
        {NAVIGATION.map((item) => (
          <li key={item.view}>
            <button
              type="button"
              onClick={() => onNavigate(item.view)}
              className={`sidebar__button${
                currentView === item.view ? ' sidebar__button--active' : ''
              }`}
              aria-current={currentView === item.view ? 'page' : undefined}
            >
              <span aria-hidden className="sidebar__icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="sidebar__signout"
        onClick={onSignOut}
        aria-label="Sair"
      >
        <span aria-hidden className="sidebar__icon">{ICONS.logout}</span>
        <span>Sair</span>
      </button>
    </nav>
  );
}
