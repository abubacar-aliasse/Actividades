import type { ReactNode } from 'react';

interface AppLayoutProps {
  sidebar: ReactNode;
  header?: ReactNode;
  children: ReactNode;
}

export function AppLayout({ sidebar, header, children }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">{sidebar}</aside>
      <main className="app-shell__content">
        {header && <header className="app-shell__header">{header}</header>}
        <div className="app-shell__body">
          <div className="app-shell__container">{children}</div>
        </div>
      </main>
    </div>
  );
}
