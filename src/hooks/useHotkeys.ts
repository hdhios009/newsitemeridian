
import { useEffect } from 'react';
import { uiStore } from '../stores/uiStore';
import { themeStore } from '../stores/themeStore';

/** Shell-level hotkeys only. Booking / command palette arrive later. */
export function useHotkeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        uiStore.closeMenus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Keep themeStore referenced so tree-shaking does not drop early apply side-effect imports elsewhere.
  void themeStore;
}
