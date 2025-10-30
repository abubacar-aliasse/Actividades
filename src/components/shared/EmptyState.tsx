import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon = (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 8h10" />
      <path d="M7 12h6" />
    </svg>
  ),
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="empty-state card">
      <div className="card__body empty-state__body">
        <span className="empty-state__icon" aria-hidden>
          {icon}
        </span>
        <p className="empty-state__title">{title}</p>
        {description && (
          <p className="empty-state__description">{description}</p>
        )}
        {action}
      </div>
    </div>
  );
}
