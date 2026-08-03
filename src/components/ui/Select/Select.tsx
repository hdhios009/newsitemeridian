import type { SelectHTMLAttributes, ReactNode } from 'react';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  children: ReactNode;
};

export function Select({ label, hint, className = '', children, ...rest }: SelectProps) {
  return (
    <label style={{ display: 'block' }}>
      {label ? <span className="field-label">{label}</span> : null}
      <select className={['input', className].filter(Boolean).join(' ')} {...rest}>
        {children}
      </select>
      {hint ? <div className="field-hint">{hint}</div> : null}
    </label>
  );
}
