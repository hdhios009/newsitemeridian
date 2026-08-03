import type { ReactNode } from 'react';
import { Icon } from '../../ui/Icon';
import { Logo } from '../../ui/Logo';

export type AuthShellProps = {
  children: ReactNode;
};

const BENEFITS = [
  'Создание записи и ссылки на оплату — за 30 секунд',
  'Автонапоминания клиенту в Telegram и WhatsApp',
  'ЮKassa для приёма платежей от физлиц',
] as const;

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div
        className="desktop-only"
        style={{
          padding: '40px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'var(--surf)',
          borderRight: '1px solid var(--border)',
        }}
      >
        <div>
          <Logo size="md" />
        </div>
        <div style={{ maxWidth: 440 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--ink)',
              lineHeight: 1.15,
            }}
          >
            Записи, клиенты и оплаты — в одном месте.
          </h2>
          <p style={{ margin: '16px 0 32px', fontSize: 15, color: 'var(--muted)', lineHeight: 1.55 }}>
            Meridian берёт рутину на себя: расписание, ссылки на оплату и историю встреч с каждым клиентом.
          </p>
          <div style={{ display: 'grid', gap: 12 }}>
            {BENEFITS.map((r) => (
              <div key={r} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'var(--primarySoft)',
                    color: 'var(--primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <Icon name="check" size={12} />
                </span>
                <span style={{ fontSize: 14 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--dim)' }}>© 2026 Meridian</div>
      </div>

      <div
        style={{
          padding: 40,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'var(--bg)',
        }}
      >
        <div className="mobile-only" style={{ marginBottom: 32 }}>
          <Logo size="md" />
        </div>
        <div style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>{children}</div>
      </div>
    </div>
  );
}
