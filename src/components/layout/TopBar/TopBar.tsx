import { useLocation } from 'react-router-dom';
import { useSyncExternalStore } from 'react';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import { IconButton } from '../../ui/IconButton';
import { Logo } from '../../ui/Logo';
import { ROUTE_TITLES } from '../../../utils/routes';
import { useTheme } from '../../../hooks/useTheme';
import { toastStore } from '../../../stores/toastStore';
import { uiStore } from '../../../stores/uiStore';

function routeTitle(pathname: string): string {
  if (pathname.startsWith('/client/')) return ROUTE_TITLES.client;
  const key = pathname.replace(/^\//, '').split('/')[0] || 'dashboard';
  return ROUTE_TITLES[key] || 'Главная';
}

const NOTIFS = [
  { k: 'warn', title: 'Оплата ждёт клиента', body: 'София Лебедева — ссылка отправлена 12 минут назад.', at: '12 мин' },
  { k: 'success', title: 'Оплата зачислена', body: 'Маша Соколова оплатила 2 500 ₽.', at: 'сегодня, 10:00' },
  { k: 'info', title: 'Завтра свободное окно', body: '12:00–13:00 — можно предложить клиенту.', at: 'вчера, 21:12' },
] as const;

export function TopBar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const ui = useSyncExternalStore(uiStore.subscribe, uiStore.getSnapshot, uiStore.getSnapshot);
  const title = routeTitle(location.pathname);

  return (
    <header
      style={{
        height: 68,
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        gap: 16,
        background: 'var(--bg)',
        position: 'sticky',
        top: 0,
        zIndex: 5,
      }}
    >
      <div className="mobile-only">
        <Logo size="sm" />
      </div>
      <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
        <span style={{ color: 'var(--ink)', fontWeight: 600, fontSize: 19, letterSpacing: '-0.015em' }}>{title}</span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
        <IconButton
          label={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          onClick={toggleTheme}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </IconButton>

        <div style={{ position: 'relative' }}>
          <IconButton label="Уведомления" onClick={() => uiStore.toggleNotif()} style={{ position: 'relative' }}>
            <Icon name="bell" />
            <span
              style={{
                position: 'absolute',
                top: 9,
                right: 10,
                width: 7,
                height: 7,
                background: 'var(--danger)',
                borderRadius: '50%',
                border: '2px solid var(--bg)',
              }}
            />
          </IconButton>

          {ui.notifOpen ? (
            <div
              className="pop"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 380,
                background: 'var(--surf)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                boxShadow: 'var(--shadowLg)',
                overflow: 'hidden',
                zIndex: 30,
              }}
            >
              <div
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--divider)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Уведомления</div>
                <Button variant="ghost" style={{ padding: '3px 6px', fontSize: 12.5 }} onClick={() => toastStore.push('Всё прочитано')}>
                  Прочитать всё
                </Button>
              </div>
              {NOTIFS.map((n, i) => {
                const col = n.k === 'success' ? 'var(--success)' : n.k === 'warn' ? 'var(--warn)' : 'var(--primary)';
                return (
                  <div
                    key={n.title}
                    className="row"
                    style={{
                      padding: '12px 16px',
                      borderBottom: i < NOTIFS.length - 1 ? '1px solid var(--divider)' : 'none',
                      display: 'flex',
                      gap: 10,
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: col, marginTop: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>{n.title}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--dim)' }}>{n.at}</div>
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3, lineHeight: 1.5 }}>{n.body}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11.5, color: 'var(--dim)', whiteSpace: 'nowrap' }}>3 простых шага</span>
          <Button variant="primary" style={{ height: 40, padding: '0 16px', fontSize: 14 }}>
            <Icon name="plus" size={15} />
            Новая запись
          </Button>
        </div>
      </div>
    </header>
  );
}
