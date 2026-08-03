import type { InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export function Input({ label, hint, className = '', id, ...rest }: InputProps) {
  const inputId = id ?? rest.name;
  return (
    <label style={{ display: 'block' }}>
      {label ? <span className="field-label">{label}</span> : null}
      <input id={inputId} className={['input', className].filter(Boolean).join(' ')} {...rest} />
      {hint ? <div className="field-hint">{hint}</div> : null}
    </label>
  );
}
