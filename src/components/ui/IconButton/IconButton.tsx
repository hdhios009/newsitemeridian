import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  label?: string;
};

export function IconButton({ children, className = '', label, style, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      className={['btn', 'hover-ink', className].filter(Boolean).join(' ')}
      aria-label={label}
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        color: 'var(--muted)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
