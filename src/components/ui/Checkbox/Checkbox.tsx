import type { InputHTMLAttributes } from 'react';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
};

export function Checkbox({ label, style, ...rest }: CheckboxProps) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', ...style }}>
      <input type="checkbox" style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} {...rest} />
      {label}
    </label>
  );
}
