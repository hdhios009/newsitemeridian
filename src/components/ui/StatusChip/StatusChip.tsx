import type { CSSProperties, ReactNode } from 'react';

export type StatusChipProps = {
  label: string;
  color?: string;
  background?: string;
  border?: string;
  dot?: string;
  children?: ReactNode;
  style?: CSSProperties;
};

export function StatusChip({
  label,
  color = 'var(--muted)',
  background = 'var(--surf2)',
  border = 'var(--border)',
  dot,
  style,
}: StatusChipProps) {
  return (
    <span
      className="chip"
      style={{
        color,
        background,
        borderColor: border,
        ...style,
      }}
    >
      {dot ? <span className="chip-dot" style={{ background: dot }} /> : null}
      {label}
    </span>
  );
}
