import { AuthShell } from '../../components/layout/AuthShell';
import { ToastHost } from '../../components/ui/Toast';

export function LoginPage() {
  return (
    <>
      <AuthShell>
        <div className="fade-in">
          <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Войти в Meridian
          </h1>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: 'var(--muted)' }}>Записи, клиенты и оплаты — в одном месте</p>
        </div>
      </AuthShell>
      <ToastHost />
    </>
  );
}
