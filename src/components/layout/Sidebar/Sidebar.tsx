import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useSyncExternalStore } from 'react';
import { Avatar } from '../../ui/Avatar';
import { Button } from '../../ui/Button';
import { Dropdown } from '../../ui/Dropdown';
import { Icon } from '../../ui/Icon';
import { Logo } from '../../ui/Logo';
import { CURRENT_USER } from '../../../mock-data';
import { NAV_ITEMS } from '../../../utils/routes';
import { useTheme } from '../../../hooks/useTheme';
import { uiStore } from '../../../stores/uiStore';
import { sessionPreferencesStore } from '../../../stores/sessionPreferencesStore';

function isNavActive(pathname: string, id: string) {
  if (id === 'clients') return pathname === '/clients' || pathname.startsWith('/client/');
  return pathname === `/${id}` || pathname.startsWith(`/${id}/`);
}

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const ui = useSyncExternalStore(uiStore.subscribe, uiStore.getSnapshot, uiStore.getSnapshot);
  const [showFirstHint, setShowFirstHint] = useState(() => sessionPreferencesStore.get('firstBooking') !== '1');

  return (
    <aside
      className="desktop-only"
      style={{
        width: 252,
        flexShrink: 0,
        background: 'var(--surf)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      <div style={{ padding: '24px 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size="md" />
      </div>

      <div style={{ padding: '0 14px 20px' }}>
        <Button variant="primary" style={{ width: '100%', gap: 8, height: 44 }}>
          <Icon name="plus" size={16} />
          Новая запись
          <span
            className="kbd"
            style={{
              marginLeft: 'auto',
              background: 'rgba(255,255,255,.14)',
              color: 'rgba(255,255,255,.85)',
              borderColor: 'transparent',
            }}
          >
            ⌘N
          </span>
        </Button>
        <div style={{ fontSize: 11.5, color: 'var(--dim)', textAlign: 'center', marginTop: 9, letterSpacing: '0.01em' }}>
          Клиент → время → оплата
        </div>
        {showFirstHint ? (
          <div
            style={{
              marginTop: 10,
              padding: '10px 12px',
              background: 'var(--primarySoft)',
              border: '1px solid var(--primaryBorder)',
              borderRadius: 10,
              fontSize: 12,
              color: 'var(--primaryInk)',
              lineHeight: 1.5,
              position: 'relative',
            }}
          >
            <button
              type="button"
              aria-label="Скрыть подсказку"
              className="btn"
              onClick={() => {
                sessionPreferencesStore.set('firstBooking', '1');
                setShowFirstHint(false);
              }}
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 20,
                height: 20,
                color: 'var(--dim)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
              }}
            >
              <Icon name="x" size={11} />
            </button>
            <span style={{ display: 'block', paddingRight: 16 }}>Первая запись займёт около 30 секунд</span>
          </div>
        ) : null}
      </div>

      <nav style={{ padding: '0 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {NAV_ITEMS.map((it) => {
          const active = isNavActive(location.pathname, it.id);
          return (
            <Link key={it.id} to={`/${it.id}`} className={`nav-item${active ? ' active' : ''}`}>
              <Icon name={it.icon} size={20} />
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: 12, borderTop: '1px solid var(--divider)', position: 'relative' }}>
        <button
          type="button"
          className="btn hover-surface"
          onClick={() => uiStore.toggleUserMenu()}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10 }}
        >
          <Avatar initials={CURRENT_USER.avatar} hue={CURRENT_USER.hue} size={32} fontSize={12} />
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: 'var(--ink)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {CURRENT_USER.name}
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: 'var(--dim)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {CURRENT_USER.role}
            </div>
          </div>
          <Icon name="chevD" size={14} color="var(--faint)" />
        </button>

        <Dropdown open={ui.userMenuOpen} style={{ bottom: 'calc(100% + 4px)', left: 12, right: 12, width: 'auto' }}>
          <button
            type="button"
            className="btn hover-surface"
            onClick={() => {
              uiStore.closeMenus();
              navigate('/settings');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              textAlign: 'left',
              padding: '8px 12px',
              fontSize: 13.5,
              borderRadius: 6,
              color: 'var(--text)',
            }}
          >
            <Icon name="cog" size={16} />
            Профиль
          </button>
          <button
            type="button"
            className="btn hover-surface"
            onClick={() => {
              uiStore.closeMenus();
              toggleTheme();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              textAlign: 'left',
              padding: '8px 12px',
              fontSize: 13.5,
              borderRadius: 6,
              color: 'var(--text)',
            }}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
            {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          </button>
          <div style={{ height: 1, background: 'var(--divider)', margin: '4px 6px' }} />
          <button
            type="button"
            className="btn hover-danger"
            onClick={() => {
              uiStore.closeMenus();
              navigate('/login');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              textAlign: 'left',
              padding: '8px 12px',
              fontSize: 13.5,
              borderRadius: 6,
              color: 'var(--danger)',
            }}
          >
            <Icon name="logout" size={16} color="inherit" />
            Выйти
          </button>
        </Dropdown>
      </div>
    </aside>
  );
}
