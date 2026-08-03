import type { CSSProperties, ReactNode } from 'react';

export type DropdownProps = {
  open: boolean;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

export function Dropdown({ open, children, style, className = '' }: DropdownProps) {
  if (!open) return null;
  return (
    <div
      className={['pop', className].filter(Boolean).join(' ')}
      style={{
        position: 'absolute',
        background: 'var(--surf)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        boxShadow: 'var(--shadowLg)',
        padding: 4,
        zIndex: 30,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
