import type { HTMLAttributes, ReactNode } from 'react';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
  children?: ReactNode;
};

export function Card({ hover = false, className = '', children, ...rest }: CardProps) {
  return (
    <div className={['card', hover ? 'card-hover' : '', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}
