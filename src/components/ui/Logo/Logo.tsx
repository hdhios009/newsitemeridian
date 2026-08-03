type LogoSize = 'sm' | 'md' | 'lg';

export type LogoProps = {
  size?: LogoSize;
  className?: string;
};

export function Logo({ size = 'md', className = '' }: LogoProps) {
  return <span className={['logo-mark', `logo-${size}`, className].filter(Boolean).join(' ')} aria-label="meridian." />;
}
