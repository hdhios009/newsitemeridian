
import { useSyncExternalStore } from 'react';
import { themeStore } from '../stores/themeStore';

export function useTheme() {
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.getSnapshot, themeStore.getSnapshot);
  return {
    theme,
    setTheme: themeStore.setTheme,
    toggleTheme: themeStore.toggle,
  };
}
