import type { Theme } from '../types/theme';

const STORAGE_KEY = 'meridian.theme';

function readInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* ignore */
  }
  if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

type Listener = () => void;

let theme: Theme = readInitialTheme();
const listeners = new Set<Listener>();

function applyDom(next: Theme) {
  document.documentElement.setAttribute('data-theme', next);
}

applyDom(theme);

export const themeStore = {
  getSnapshot(): Theme {
    return theme;
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setTheme(next: Theme) {
    theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    applyDom(next);
    listeners.forEach((l) => l());
  },
  toggle() {
    themeStore.setTheme(theme === 'dark' ? 'light' : 'dark');
  },
};
