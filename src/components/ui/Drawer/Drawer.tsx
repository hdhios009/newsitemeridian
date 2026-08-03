import type { ReactNode } from 'react';
import { Icon } from '../Icon';

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: number | string;
};

export function Drawer({ open, onClose, title, children, width = 440 }: DrawerProps) {
  if (!open) return null;
  return (
    <div
      className="fade-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,.42)',
        zIndex: 70,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        className="sheet-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          maxWidth: '100%',
          height: '100%',
          background: 'var(--surf)',
          borderLeft: '1px solid var(--border)',
          boxShadow: 'var(--shadowLg)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {title ? (
          <div
            style={{
              padding: '18px 20px',
              borderBottom: '1px solid var(--divider)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{title}</div>
            <button
              type="button"
              className="btn hover-ink"
              aria-label="Закрыть"
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                color: 'var(--dim)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="x" size={16} />
            </button>
          </div>
        ) : null}
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}
