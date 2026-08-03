import type { CSSProperties } from 'react';

export type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
  className?: string;
};

export function Skeleton({ width = '100%', height = 16, style, className = '' }: SkeletonProps) {
  return <div className={['skel', className].filter(Boolean).join(' ')} style={{ width, height, ...style }} />;
}
