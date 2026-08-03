import { useSyncExternalStore } from 'react';
import { Icon, type IconName } from '../Icon';
import { toastStore } from '../../../stores/toastStore';

export function ToastHost() {
  const toasts = useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot, toastStore.getSnapshot);
  if (!toasts.length) return null;

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 80 }}>
      {toasts.map((x) => {
        const col =
          x.kind === 'success'
            ? 'var(--success)'
            : x.kind === 'warn'
              ? 'var(--warn)'
              : x.kind === 'error'
                ? 'var(--danger)'
                : 'var(--primary)';
        return (
          <div
            key={x.id}
            className="toast-in"
            style={{
              background: 'var(--ink)',
              color: 'var(--bg)',
              padding: '12px 16px',
              borderRadius: 10,
              boxShadow: 'var(--shadowLg)',
              fontSize: 13.5,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              minWidth: 260,
              maxWidth: 400,
            }}
          >
            <Icon name={(x.icon as IconName) || 'check'} size={16} color={col} />
            <span style={{ flex: 1 }}>{x.msg}</span>
          </div>
        );
      })}
    </div>
  );
}
