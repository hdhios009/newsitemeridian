import type { ReactNode } from 'react';

export type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
};

/** Minimal title-based tooltip matching native browser behavior without redesign. */
export function Tooltip({ content, children }: TooltipProps) {
  const title = typeof content === 'string' ? content : undefined;
  return (
    <span title={title} style={{ display: 'inline-flex' }}>
      {children}
    </span>
  );
}
