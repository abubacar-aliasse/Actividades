import { useMemo } from 'react';
import { useActivities } from '../../hooks/useActivities';
import { useNotes } from '../../hooks/useNotes';
import { useCategories } from '../../hooks/useCategories';
import {
  displayCategoryLabel,
  formatActivityDate,
  formatDateDisplay,
  normalizeCategoryLabel,
  todayDateInputValue,
} from '../../utils/formatters';
import { computeActivityStats } from '../../utils/activityStats';
import { computeNoteStats } from '../../utils/noteStats';
import { EmptyState } from '../shared/EmptyState';
import {
  getCategoryDefinition,
  getFieldDefinitions,
  getSelectOptionLabel,
} from '../../utils/categoryHelpers';

const DAILY_TREND_DAYS = 7;
const RECENT_LIMIT = 5;
const CATEGORY_LIMIT = 6;

export function DashboardOverview() {
  const { activities, updateActivity } = useActivities();
  const { notes, updateNote } = useNotes();
  const noteStats = useMemo(() => computeNoteStats(notes), [notes]);
  const { categories } = useCategories();

  const activityStats = useMemo(
    () => computeActivityStats(activities, DAILY_TREND_DAYS),
    [activities],
  );

  const categorySummary = useMemo(() => {
    const summary = new Map<string, { count: number; label: string }>();

    activities.forEach((activity) => {
      const key = normalizeCategoryLabel(activity.category);
      const label = displayCategoryLabel(activity.category);
      const current = summary.get(key);

      summary.set(key, {
        label,
        count: current ? current.count + 1 : 1,
      });
    });

    return Array.from(summary.values()).sort((a, b) => b.count - a.count);
  }, [activities]);

  const recentActivities = useMemo(
    () => activities.slice(0, RECENT_LIMIT),
    [activities],
  );

  const trendMax = activityStats.dailyTrend.reduce(
    (acc, entry) => Math.max(acc, entry.count),
    0,
  );

  const handleActivityReschedule = (activityId: string) => {
    const activity = activities.find((item) => item.id === activityId);
    if (!activity) return;

    const currentDate = activity.nextFollowUp ?? todayDateInputValue();
    const nextDate = window.prompt(
      'Informe a nova data (AAAA-MM-DD)',
      currentDate,
    );

    if (!nextDate) {
      return;
    }

    updateActivity(activityId, {
      description: activity.description,
      category: activity.category,
      categoryId: activity.categoryId,
      status: activity.status,
      statusUpdatedAt: activity.statusUpdatedAt,
      nextFollowUp: nextDate,
      fields: {
        ...(activity.fields ?? {}),
        proxima_cobranca: nextDate,
      },
    });
  };

  const handleNoteReschedule = (noteId: string) => {
    const note = notes.find((item) => item.id === noteId);
    if (!note) return;

    const currentDate = note.alertDate ?? todayDateInputValue();
    const nextDate = window.prompt(
      'Informe a nova data (AAAA-MM-DD)',
      currentDate,
    );

    if (!nextDate) {
      return;
    }

    updateNote(noteId, {
      date: note.date,
      name: note.name,
      status: note.status,
      closeDate: note.closeDate,
      description: note.description,
      alertDate: nextDate,
      statusUpdatedAt: note.statusUpdatedAt,
    });
  };

  if (activityStats.totalActivities === 0 && notes.length === 0) {
    return (
      <EmptyState
        title="Sem dados ainda"
        description="Adicione atividades ou notas para visualizar indicadores no painel."
        action={
          <p className="empty-state__hint">
            Utilize os menus Registo ou Notas para criar a primeira entrada.
          </p>
        }
      />
    );
  }

  const topCategories = categorySummary.slice(0, CATEGORY_LIMIT);
  const hasMoreCategories = categorySummary.length > CATEGORY_LIMIT;

  return (
    <section className="dashboard">
      <div className="dashboard__grid dashboard__grid--summary">
        <article className="card dashboard__card">
          <div className="card__body">
            <h2 className="dashboard__title">Total de atividades</h2>
            <p className="dashboard__metric">{activityStats.totalActivities}</p>
            <p className="dashboard__description">
              Historico completo registrado na aplicacao.
            </p>
          </div>
        </article>

        <article className="card dashboard__card">
          <div className="card__body">
            <h2 className="dashboard__title">Entradas de hoje</h2>
            <p className="dashboard__metric">{activityStats.todayActivities}</p>
            <p className="dashboard__description">
              Atividades criadas na data atual.
            </p>
          </div>
        </article>

        <article className="card dashboard__card">
          <div className="card__body">
            <h2 className="dashboard__title">Notas activas</h2>
            <p className="dashboard__metric">{noteStats.total}</p>
            <p className="dashboard__description">
              Total de notas registadas até o momento.
            </p>
          </div>
        </article>

        <article className="card dashboard__card">
          <div className="card__body">
            <h2 className="dashboard__title">Alertas de hoje</h2>
            <div className="dashboard__metric-group">
              <span className="dashboard__metric">
                {activityStats.dueFollowUps.length + noteStats.dueAlerts.length}
              </span>
              <span className="dashboard__metric-note">itens pendentes</span>
            </div>
            <p className="dashboard__description">
              {activityStats.upcomingFollowUps.length + noteStats.upcomingAlerts.length}{' '}
              agendado(s) para os proximos dias.
            </p>
          </div>
        </article>
      </div>

      <article className="card">
        <div className="card__body">
          <h2 className="dashboard__title">Alertas</h2>
          <div className="dashboard__alerts-grid">
            <section>
              <h3>Atividades</h3>
              {activityStats.dueFollowUps.length === 0 ? (
                <p className="dashboard__hint">
                  Nenhuma cobranca necessitando acompanhamento hoje.
                </p>
              ) : (
                <ul className="dashboard__alerts">
                  {activityStats.dueFollowUps.map((activity) => {
                    const category = getCategoryDefinition(
                      categories,
                      activity.categoryId,
                    );
                    const fields = getFieldDefinitions(category);
                    const statusField = fields.find((field) => field.key === 'status');
                    const statusLabel = statusField
                      ? getSelectOptionLabel(statusField, activity.status ?? '') ?? activity.status
                      : activity.status;

                    return (
                      <li key={activity.id} className="dashboard__alert">
                        <div>
                          <p className="dashboard__alert-title">{activity.description}</p>
                          <p className="dashboard__alert-meta">
                            {category?.name ?? activity.category ?? 'Categoria desconhecida'}
                          </p>
                          <p className="dashboard__alert-meta">
                            Status: {statusLabel ?? 'Sem status'} - Proxima cobranca:{' '}
                            {formatDateDisplay(activity.nextFollowUp ?? '') || '-'}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="button button--outline"
                          onClick={() => handleActivityReschedule(activity.id)}
                        >
                          Reagendar
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
            <section>
              <h3>Notas</h3>
              {noteStats.dueAlerts.length === 0 ? (
                <p className="dashboard__hint">Nenhum alerta de nota para hoje.</p>
              ) : (
                <ul className="dashboard__alerts">
                  {noteStats.dueAlerts.map((note) => (
                    <li key={note.id} className="dashboard__alert">
                      <div>
                        <p className="dashboard__alert-title">{note.name}</p>
                        <p className="dashboard__alert-meta">Status: {note.status}</p>
                        <p className="dashboard__alert-meta">
                          Alerta: {formatDateDisplay(note.alertDate ?? '') || '-'}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="button button--outline"
                        onClick={() => handleNoteReschedule(note.id)}
                      >
                        Reagendar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {(activityStats.upcomingFollowUps.length > 0 ||
            noteStats.upcomingAlerts.length > 0) && (
            <div className="dashboard__alerts-upcoming">
              <h3>Proximos 7 dias</h3>
              <div className="dashboard__alerts-grid">
                <ul>
                  {activityStats.upcomingFollowUps.map((activity) => (
                    <li key={activity.id}>
                      <span>{activity.description}</span>
                      <span>{formatDateDisplay(activity.nextFollowUp ?? '')}</span>
                    </li>
                  ))}
                </ul>
                <ul>
                  {noteStats.upcomingAlerts.map((note) => (
                    <li key={note.id}>
                      <span>{note.name}</span>
                      <span>{formatDateDisplay(note.alertDate ?? '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </article>

      <div className="dashboard__grid dashboard__grid--details">
        <article className="card">
          <div className="card__body">
            <h2 className="dashboard__title">Resumo por categoria</h2>
            <ul className="dashboard__list">
              {topCategories.map((category) => (
                <li key={category.label}>
                  <span>{category.label}</span>
                  <strong>{category.count}</strong>
                </li>
              ))}
            </ul>
            {hasMoreCategories && (
              <p className="dashboard__hint">
                Outras {categorySummary.length - CATEGORY_LIMIT} categoria(s)
                com menor volume.
              </p>
            )}
          </div>
        </article>

        <article className="card">
          <div className="card__body">
            <h2 className="dashboard__title">Atividade mais recente</h2>
            {activityStats.lastActivity ? (
              <div className="dashboard__recent-card">
                <p className="dashboard__recent-description">
                  {activityStats.lastActivity.description}
                </p>
                <dl className="dashboard__recent-meta">
                  <div>
                    <dt>Categoria</dt>
                    <dd>
                      {displayCategoryLabel(activityStats.lastActivity.category)}
                    </dd>
                  </div>
                  <div>
                    <dt>Registrado em</dt>
                    <dd>{formatActivityDate(activityStats.lastActivity.createdAt)}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="dashboard__hint">
                Nenhuma atividade registrada ate o momento.
              </p>
            )}
          </div>
        </article>
      </div>

      <article className="card">
        <div className="card__body">
          <h2 className="dashboard__title">Evolucao nos ultimos dias</h2>
          <ul className="dashboard__trend">
            {activityStats.dailyTrend.map((entry) => (
              <li key={entry.date}>
                <span className="dashboard__trend-label">{entry.label}</span>
                <div className="dashboard__trend-bar">
                  <div
                    className="dashboard__trend-indicator"
                    style={{
                      width:
                        trendMax === 0 || entry.count === 0
                          ? '0%'
                          : `${Math.max((entry.count / trendMax) * 100, 12)}%`,
                    }}
                  />
                </div>
                <span className="dashboard__trend-count">{entry.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>

      <article className="card">
        <div className="card__body">
          <h2 className="dashboard__title">Atividades recentes</h2>
          <ol className="dashboard__recent">
            {recentActivities.map((activity) => (
              <li key={activity.id}>
                <span className="dashboard__recent-category">
                  {displayCategoryLabel(activity.category)}
                </span>
                <p>{activity.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </article>
    </section>
  );
}
