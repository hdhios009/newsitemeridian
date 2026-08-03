import type { ReactNode } from 'react';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: number | string;
  zIndex?: number;
};

export function Modal({ open, onClose, children, width = 480, zIndex = 80 }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fade-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,.42)',
        zIndex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        className="pop"
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          maxWidth: '100%',
          background: 'var(--surf)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          boxShadow: 'var(--shadowLg)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
