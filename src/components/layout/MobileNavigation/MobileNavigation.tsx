import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../../ui/Icon';

const items = [
  { id: 'dashboard', label: 'Главная', icon: 'home' as const },
  { id: 'bookings', label: 'Записи', icon: 'book' as const },
  { id: 'new', label: '', icon: 'plus' as const, primary: true },
  { id: 'clients', label: 'Клиенты', icon: 'users' as const },
  { id: 'payments', label: 'Оплаты', icon: 'wallet' as const },
];

function isActive(pathname: string, id: string) {
  if (id === 'clients') return pathname === '/clients' || pathname.startsWith('/client/');
  return pathname === `/${id}`;
}

export function MobileNavigation() {
  const location = useLocation();

  return (
    <nav
      className="mobile-nav"
      style={{
        display: 'none',
        position: 'sticky',
        bottom: 0,
        background: 'var(--surf)',
        borderTop: '1px solid var(--border)',
        padding: '8px 12px',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 4,
      }}
    >
      {items.map((it) => {
        if (it.primary) {
          return (
            <button
              key={it.id}
              type="button"
              className="btn"
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: 'var(--primary)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 18px -4px rgba(37,99,235,.5)',
                marginTop: -16,
                border: '4px solid var(--surf)',
              }}
            >
              <Icon name="plus" size={22} />
            </button>
          );
        }

        const active = isActive(location.pathname, it.id);
        return (
          <Link
            key={it.id}
            to={`/${it.id}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '8px 12px',
              color: active ? 'var(--primary)' : 'var(--dim)',
              minWidth: 44,
            }}
          >
            <Icon name={it.icon} size={20} color="inherit" />
            <span style={{ fontSize: 11, fontWeight: active ? 500 : 400 }}>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
