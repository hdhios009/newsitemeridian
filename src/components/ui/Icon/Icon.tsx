import type { CSSProperties } from 'react';
import { iconPaths, type IconName } from './icons';

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
};

export function Icon({ name, size = 18, color, className = 'ico', style }: IconProps) {
  const paths = iconPaths[name] ?? iconPaths.info;
  return (
    <span
      className={className}
      style={{
        width: size,
        height: size,
        color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {paths}
      </svg>
    </span>
  );
}
