import type { ButtonHTMLAttributes } from 'react';

export type ToggleProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Toggle({ checked = false, onCheckedChange, className = '', ...rest }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={['toggle', checked ? 'on' : '', className].filter(Boolean).join(' ')}
      onClick={(e) => {
        rest.onClick?.(e);
        onCheckedChange?.(!checked);
      }}
      {...rest}
    />
  );
}
