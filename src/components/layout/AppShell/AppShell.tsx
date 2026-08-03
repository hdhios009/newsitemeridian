import type { ReactNode } from 'react';
import { MobileNavigation } from '../MobileNavigation';
import { Sidebar } from '../Sidebar';
import { TopBar } from '../TopBar';
import { ToastHost } from '../../ui/Toast';
import { useHotkeys } from '../../../hooks/useHotkeys';

export type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  useHotkeys();

  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <TopBar />
          <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
          <MobileNavigation />
        </main>
      </div>
      <ToastHost />
    </>
  );
}
