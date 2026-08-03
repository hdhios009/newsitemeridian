import { AuthShell } from '../../components/layout/AuthShell';
import { ToastHost } from '../../components/ui/Toast';

export function ForgotPasswordPage() {
  return (
    <>
      <AuthShell>
        <div className="fade-in">
          <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Сбросить пароль
          </h1>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: 'var(--muted)' }}>Пришлём ссылку для восстановления на email.</p>
        </div>
      </AuthShell>
      <ToastHost />
    </>
  );
}
