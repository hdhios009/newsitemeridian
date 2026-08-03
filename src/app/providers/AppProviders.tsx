import type { ReactNode } from 'react';
import { themeStore } from '../../stores/themeStore';

// Ensure theme side-effect (data-theme) runs before first paint of app tree.
void themeStore.getSnapshot();

export function AppProviders({ children }: { children: ReactNode }) {
  return children;
}
