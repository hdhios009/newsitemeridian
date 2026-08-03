import type { CSSProperties, HTMLAttributes } from 'react';

export type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  initials: string;
  hue?: number;
  size?: number;
  radius?: number | string;
  fontSize?: number;
};

export function Avatar({
  initials,
  hue = 220,
  size = 32,
  radius,
  fontSize,
  className = '',
  style,
  ...rest
}: AvatarProps) {
  const computed: CSSProperties = {
    width: size,
    height: size,
    background: `hsl(${hue} 65% 52%)`,
    fontSize: fontSize ?? Math.round(size * 0.375),
    borderRadius: radius ?? '50%',
    ...style,
  };
  return (
    <div className={['avatar', className].filter(Boolean).join(' ')} style={computed} {...rest}>
      {initials}
    </div>
  );
}
